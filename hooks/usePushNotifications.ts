import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { addPendingReview } from '@/lib/reviewStorage';
import { router } from 'expo-router';

const isExpoGo = Constants.executionEnvironment === 'storeClient';

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;
    isLoading: boolean;
    error?: string;
}

// Set default notification handler outside the hook to avoid conflicts
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowAlert: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const usePushNotifications = (): PushNotificationState => {
    // States to store the push token, notification, loading and error
    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>();

    // Refs for notification listeners to avoid re-initialization on each render
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    // Function to register the device for push notifications
    async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | undefined> {
        try {
            if (!Device.isDevice) {
                setError("Please use a physical device for push notifications");
                return;
            }

            // Expo Go does not support remote push tokens on Android (SDK 53+).
            if (isExpoGo) {
                return;
            }

            // Get current permission status
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // If permission is not granted, request permission
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                setError("Permission to receive push notifications was denied");
                return;
            }

            // Get the Expo push token
            const token = await Notifications.getExpoPushTokenAsync({
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
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to register for push notifications';
            setError(errorMessage);
            console.error('Error registering for push notifications:', err);
            return;
        }
    }

    // Set up the listeners and register for push notifications when the component mounts
    useEffect(() => {
        let isMounted = true;

        const setupPushNotifications = async () => {
            try {
                setIsLoading(true);
                setError(undefined);
                
                // Register for push notifications and set the token
                const token = await registerForPushNotificationsAsync();
                
                if (isMounted) {
                    setExpoPushToken(token);
                }
            } catch (err) {
                if (isMounted) {
                    const errorMessage = err instanceof Error ? err.message : 'Failed to setup push notifications';
                    setError(errorMessage);
                    console.error('Error setting up push notifications:', err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        setupPushNotifications();

        // Add notification listener for receiving notifications (app đang mở)
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            if (isMounted) {
                setNotification(notification);
            }
            try {
                const data = notification.request?.content?.data;
                if (data?.type === 'chinh_nha_review' && data?.chinh_nha_id) {
                    addPendingReview(Number(data.chinh_nha_id));
                }
            } catch (e) {
                console.log('Error processing notification:', e);
            }
        });

        // Add listener for notification response (khi user click vào notification)
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            try {
                const data = response.notification?.request?.content?.data;
                if (data?.type === 'chinh_nha_review' && data?.chinh_nha_id) {
                    addPendingReview(Number(data.chinh_nha_id));
                    // Điều hướng sang trang Lịch hẹn
                    router.push('/lich-hen');
                }
            } catch (e) {
                console.log('Error processing notification response:', e);
            }
        });

        // Cleanup listeners on component unmount
        return () => {
            isMounted = false;
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    // Return the push token, notification state, loading and error states
    return {
        expoPushToken,
        notification,
        isLoading,
        error,
    };
};
