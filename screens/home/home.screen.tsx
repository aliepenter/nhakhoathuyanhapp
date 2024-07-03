import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import CustomButton from "@/components/CustomButton";
import { Link, Redirect, router } from "expo-router";
import { getVideos, logout } from "@/lib/apiCall";
import useUser from "@/hooks/auth/useUser";

const DATA: any = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const HomeScreen = () => {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState([]);
  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  const handleLogout = async () => {
    if (logout) {
      try {
        await logout();
      } catch (error) {
        Alert.alert("Đăng xuất thất bại", "Xin vui thử lại sau");
      }
    } else {
      Alert.alert("Đăng xuất thất bại", "Xin vui thử lại sau");
    }
  };

  useEffect(() => {
    const videos = async () => {
      const videos: any = await getVideos();
      if (videos) {
        setVideos(videos.data);
      }
    };
    videos();
  }, []);

  return (
    <View className="h-full bg-white">
      <View className="h-[175px]">
        <ImageBackground source={images.bgHeaderHome} resizeMode='stretch' className='flex-1'>
          <View className="flex-row flex-1 justify-start ml-7 mt-10 items-center">
            <Image source={images.logo} resizeMode='contain' className='w-[100px] h-[100px]' />
            <View className="ml-7">
              <View className="flex-row items-center">
                <Text className="text-white text-[14px]">Xin chào, </Text>
                <Text className="text-white size-[14px] font-pbold">{user?.ho_va_ten}</Text>
              </View>
              <Text className="text-white text-[14px] font-pbold">{user?.so_dien_thoai}</Text>
              <Text className="text-white text-[14px] font-semibold">{user?.dia_chi}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default HomeScreen;
