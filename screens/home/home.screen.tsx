import {
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getVideos, getBanners, getOnlyNews } from "@/lib/apiCall";
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
  const [post, setPost] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const onRefresh = async () => {
    setRefreshing(true);
    setVideos([]);
    setBanners([]);
    setPost([]);
    setSchedule(null);
    setTotalTime(null);
    await fetchBannerData();
    await fetchVideoData();
    await fetchNews();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVideoData();
    fetchBannerData();
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const postData = await getOnlyNews();
      setTimeout(() => {
        if (postData) {
          setPost(postData.data);
        }
      }, 1000);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
      <HeaderSection user={user} showNotification={true} />
      <FlatList
        data={[{ key: 'banner' }, { key: 'functions' }, { key: 'timetracking' }, { key: 'trending' }, { key: 'news' }, { key: 'last' }]}
        renderItem={({ item }) => {
          switch (item.key) {
            case 'banner':
              return <BannerSlide banners={banners} type={1} />;
            case 'functions':
              return <FunctionItemsList />;
            case 'timetracking':
              return <TimeTracking schedule="07/07/2024" totalTime="250" />;
            case 'trending':
              return <RenderVideo videos={videos} />;
            case 'news':
              return <NewsSection post={post} />;
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
