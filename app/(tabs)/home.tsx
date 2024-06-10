import {
  Alert,
  FlatList,
  Image,
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
import { useAuth } from "@/context/GlobalProvider";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { getVideos } from "@/lib/apiCall";
const DATA: any = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState([]);
  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  const { authState, onLogout } = useAuth();

  const handleLogout = async () => {
    if (onLogout) {
      try {
        await onLogout();
      } catch (error) {
        Alert.alert("Đăng xuất thất bại", "Xin vui thử lại sau");
      }
    } else {
      Alert.alert("Đăng xuất thất bại", "Xin vui thử lại sau");
    }
  };

  useEffect(() => {
    if (!authState || authState.isLoggedIn === false) {
      router.push('/sign-in');
    }
    const videos = async () => {
      const videos: any = await getVideos();
      if (videos) {
        setVideos(videos.data);
      }
    };
    videos();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text className="text-3xl text-white">{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start mb-6 flex-row">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Xin chào
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {authState?.userInfo?.ho_va_ten}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 pb-8">
              <View className="justify-between items-start mb-6 flex-row">
                <View>
                  <Text className="text-gray-100 text-2xl font-pregular mb-3">
                    Video nổi bật
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Link
                    href="/sign-up"
                    className="text-gray-100 text-sm font-pregular text-blue-500"
                  >
                    Xem tất cả
                  </Link>
                </View>
              </View>
              <Trending posts={videos ?? []} />
            </View>
            <CustomButton
              title="Logout"
              handlePress={handleLogout}
              containerStyles="w-full mt-7"
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
