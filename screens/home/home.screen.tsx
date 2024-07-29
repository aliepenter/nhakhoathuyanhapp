import {
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getBanners, getPosts, getTrending } from "@/lib/apiCall";
import useUser from "@/hooks/auth/useUser";
import FunctionItemsList from "@/components/home/FunctionItem";
import RenderVideo from "@/components/home/RenderVideo";
import BannerSlide from "@/components/common/BannerSlide";
import NewsSection from "@/components/home/NewsSection";
import HeaderSection from "@/components/home/HeaderSection";
import TimeTracking from "@/components/home/TimeTracking";
import { calculateDaysDifference, formatDate } from "@/lib/commonFunctions";
import Toast from "react-native-toast-message";


const HomeScreen = () => {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [post, setPost] = useState([]);

  const [flag, setFlag] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setVideos([]);
    setBanners([]);
    setPost([]);
    await fetchBannerData();
    await fetchVideoData();
    await fetchNews();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVideoData();
    fetchBannerData();
    fetchNews();
    showToast();
  }, []);

  const fetchNews = async () => {
    try {
      const postData = await getPosts();
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
      const videosResponse = await getTrending();
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
  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Thông báo',
      text2: 'Bạn có một lời dặn mới từ bác sĩ',
      autoHide: true,
      visibilityTime: 10000,
      position: 'top',
    });
  }
  return (
    <View className="bg-white">
      <HeaderSection user={user} showNotification={true} flag={flag} setFlag={setFlag} />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <BannerSlide banners={banners} type={1} />
        <FunctionItemsList flag={flag} setFlag={setFlag} />
        <TimeTracking schedule={
          user && user.ngay_gan_mc != null ? formatDate(user.ngay_gan_mc, 'minimize') : 0
        } totalTime={user && user.ngay_gan_mc != null ? calculateDaysDifference(user.ngay_gan_mc) : 0} flag={flag} setFlag={setFlag} />
        <RenderVideo videos={videos} flag={flag} setFlag={setFlag} />
        <NewsSection post={post} flag={flag} setFlag={setFlag} />
        <View className="h-[150px]"></View>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
