import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import NetInfo from '@react-native-community/netinfo';
import { Redirect } from "expo-router";
import useUser from "@/hooks/auth/useUser";
import Loader from "@/components/loader/loader";

export default function TabsIndex() {
  const { loading, user } = useUser();
  const [isConnected, setIsConnected] = useState<boolean>(true);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    if (!isConnected) {
      Alert.alert(
        'Cảnh báo',
        'Bạn cần bật kết nối mạng để tiếp tục sử dụng ứng dụng.',
        [
          {
            text: 'OK',
            onPress: () => {
              null
            }
          }
        ]
      );
    }
    return () => unsubscribe();
  }, [isConnected]);

  if (!loading) {
    return <Redirect href={!user ? "/(routes)/login" : "/(tabs)"} />;
  }
  else {
    return <Loader />;
  }
}
