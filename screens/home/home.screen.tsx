import {
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getVideos, getBanners } from "@/lib/apiCall";
import useUser from "@/hooks/auth/useUser";
import FunctionItemsList from "@/components/home/FunctionItem";
import RenderVideo from "@/components/home/RenderVideo";
import BannerSlide from "@/components/common/BannerSlide";
import NewsSection from "@/components/home/NewsSection";
import HeaderSection from "@/components/home/HeaderSection";
import TimeTracking from "@/components/home/TimeTracking";


const HomeScreen = () => {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState([]);
  const [banners, setBanners] = useState([]);
  const onRefresh = async () => {
    setRefreshing(true);
    setVideos([]);
    setBanners([]);
    await fetchBannerData();
    await fetchVideoData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVideoData();
    fetchBannerData();
  }, []);

  const fetchVideoData = async () => {
    try {
      const videosResponse = await getVideos();
      setTimeout(() => {
        if (videosResponse.data) {
          setVideos(videosResponse.data);
        }
      }, 1000);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchBannerData = async () => {
    try {
      const bannersResponse = await getBanners();
      setTimeout(() => {
        if (bannersResponse.data) {
          setBanners(bannersResponse.data);
        }
      }, 1000);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <View className="bg-white">
      <HeaderSection user={user} />
      <FlatList
        data={[{ key: 'banner' }, { key: 'functions' }, { key: 'timetracking' }, { key: 'trending' }, { key: 'news' }, { key: 'last' }]}
        renderItem={({ item }) => {
          switch (item.key) {
            case 'banner':
              return <BannerSlide banners={banners} type={1} />;
            case 'functions':
              return <FunctionItemsList />;
            case 'timetracking':
              return <TimeTracking />;
            case 'trending':
              return <RenderVideo videos={videos} />;
            case 'news':
              return <NewsSection banners={banners} />;
            case 'last':
              return <View className="h-[150px]"></View>;
            default:
              return null;
          }
        }}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};
export default HomeScreen;
