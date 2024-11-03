import {
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getBanners, getLichHenByUserId, getPosts, getTrending } from "@/lib/apiCall";
import useUser from "@/hooks/auth/useUser";
import FunctionItemsList from "@/components/home/FunctionItem";
import RenderVideo from "@/components/home/RenderVideo";
import BannerSlide from "@/components/common/BannerSlide";
import NewsSection from "@/components/home/NewsSection";
import TimeTracking from "@/components/home/TimeTracking";
import { calculateDaysDifference, checkDay, formatDate } from "@/lib/commonFunctions";
import Toast from "react-native-toast-message";
import useUnseenMessages from "@/hooks/useUnseenMessages";

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [post, setPost] = useState([]);
  const [lichHen, setLichHen] = useState(null);
  const { user } = useUser();
  const [flag, setFlag] = useState<boolean>(false);

  useEffect(() => {
    fetchVideoData();
    fetchBannerData();
    fetchNews();
    if (user) {
      fetchLichHen(user.id);
    }
    showToast();
  }, [user]);
  const onRefresh = async () => {
    setRefreshing(true);
    setVideos([]);
    setBanners([]);
    setPost([]);
    await fetchBannerData();
    await fetchVideoData();
    await fetchNews();
    if (user) {
      await fetchLichHen(user.id);
    }
    setRefreshing(false);
  };

  const fetchLichHen = async (id: number) => {
    try {
      const [lichHenRes] = await Promise.all([
        getLichHenByUserId(id),
      ]);

      if (lichHenRes && lichHenRes.data.length > 0) {
        const today = new Date();
        const upcomingAppointments = lichHenRes.data.filter((appointment: { ngay_kham: string | number | Date; }) => new Date(appointment.ngay_kham) > today);

        if (upcomingAppointments.length > 0) {
          const closestAppointment = upcomingAppointments.reduce((closest: { ngay_kham: string | number | Date; }, current: { ngay_kham: string | number | Date; }) => {
            const currentDate = new Date(current.ngay_kham);
            return !closest || (currentDate < new Date(closest.ngay_kham)) ? current : closest;
          }, null);

          if (closestAppointment) {
            setLichHen(closestAppointment.ngay_kham);
          }
        } else {
          setLichHen(null);
        }
      } else {
        setLichHen(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLichHen(null);
    }
  };

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
    if (checkDay(lichHen)) {
      Toast.show({
        type: 'tomatoToast',
        text1: 'Sắp đến lịch hẹn',
        text2: `Bạn có lịch hẹn với nha khoa Thùy Anh vào ngày ${formatDate(lichHen, 'minimize')}`,
        autoHide: true,
        visibilityTime: 10000,
        position: 'top',
      });
    }
  }
  
  return (
    <View className="bg-white">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <BannerSlide banners={banners} type={1} />
        <FunctionItemsList schedule={lichHen ? lichHen : null} flag={flag} setFlag={setFlag} />
        <TimeTracking schedule={lichHen ? formatDate(lichHen, 'minimize') : 0} totalTime={user && user.ngay_gan_mc != null ? calculateDaysDifference(user.ngay_gan_mc) : 0} flag={flag} setFlag={setFlag} />
        <RenderVideo videos={videos} flag={flag} setFlag={setFlag} />
        <NewsSection post={post} flag={flag} setFlag={setFlag} />
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
