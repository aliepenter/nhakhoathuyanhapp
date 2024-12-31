import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {
    // Set default notification handler
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldShowAlert: true,
            shouldSetBadge: true,
        }),
    });

    // States to store the push token and notification
    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    // Refs for notification listeners to avoid re-initialization on each render
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    // Function to register the device for push notifications
    async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
        let token;

        if (Device.isDevice) {
            // Get current permission status
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // If permission is not granted, request permission
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                return;
            }

            // Get the Expo push token
            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });

            // Set up Android notification channel if needed
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            return token;
        } else {
            console.log("ERROR: Please use a physical device");
        }
    }

    // Set up the listeners and register for push notifications when the component mounts
    useEffect(() => {
        // Register for push notifications and set the token
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        });

        // Add notification listener for receiving notifications
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        // Add listener for notification response (when the user taps on a notification)
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Notification responded:", response);
        });

        // Cleanup listeners on component unmount
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    // Return the push token and notification state
    return {
        expoPushToken,
        notification,
    };
};
