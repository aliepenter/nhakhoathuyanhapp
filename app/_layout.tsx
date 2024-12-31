import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { LogBox, StatusBar, View, Text, Platform, PermissionsAndroid, Alert } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import React from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded, error] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Thin": require("../assets/fonts/Inter-Thin.ttf"),
    "Mali-Bold": require("../assets/fonts/Mali-Bold.ttf"),
    "Mali-Medium": require("../assets/fonts/Mali-Medium.ttf"),
    "Mali-Regular": require("../assets/fonts/Mali-Regular.ttf"),

  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();

    LogBox.ignoreAllLogs(true);
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null;
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#51B81A' }}
        text1Style={{
          fontSize: 15,
        }}
        text2Style={{
          fontSize: 13,
        }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#3EC8E7' }}
        text1Style={{
          fontSize: 15,
        }}
        text2Style={{
          fontSize: 13,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red' }}
        text1Style={{
          fontSize: 15,
        }}
        text2Style={{
          fontSize: 13,
        }}
      />
    ),
    tomatoToast: ({ text1, text2, props }: any) => (
      <View className="w-[90%] bg-white rounded-xl border-l-[#3EC8E7] border-l-4 pt-3 pl-5">
        <Text className="text-[15px] font-bold">{text1}</Text>
        <Text className="text-[13px] text-gray-500">{text2}</Text>
        <Text>{props.uuid}</Text>
      </View>
    )
  };
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar barStyle={'light-content'} />
      <Toast config={toastConfig} />
    </>
  );
}
