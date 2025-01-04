import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Linking } from "react-native";
import NetInfo from '@react-native-community/netinfo';
import { Redirect } from "expo-router";
import useUser from "@/hooks/auth/useUser";

export default function TabsIndex() {
  const { loading, user } = useUser();
  const [isConnected, setIsConnected] = useState<boolean>(true);  // Đảm bảo là boolean


  useEffect(() => {
    // Lắng nghe sự thay đổi kết nối mạng khi component được mount
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);  // Dùng `??` để gán false nếu là null
    });

    // Kiểm tra kết nối mạng ngay khi component được mount
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
    // Cleanup khi component unmount
    return () => unsubscribe();
  }, [isConnected]); // Thêm `isConnected` để theo dõi sự thay đổi

  // Điều hướng khi có kết nối mạng và không còn đang tải
  if (!loading) {
    return <Redirect href={!user ? "/(routes)/login" : "/(tabs)"} />;
  }

  return <></>; // Không trả về JSX trong useEffect
}
