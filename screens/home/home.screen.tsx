import {
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getBanners, getCustomerLibrary, getLichHenByUserId, getPosts, getTrending, updateExpoToken } from "@/lib/apiCall";
import useUser from "@/hooks/auth/useUser";
import FunctionItemsList from "@/components/home/FunctionItem";
import RenderVideo from "@/components/home/RenderVideo";
import BannerSlide from "@/components/common/BannerSlide";
import NewsSection from "@/components/home/NewsSection";
import TimeTracking from "@/components/home/TimeTracking";
import { calculateDaysDifference, checkDay, checkTodayIsShoot, formatDate } from "@/lib/commonFunctions";
import Toast from "react-native-toast-message";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import * as Application from 'expo-application';
import { getVersion } from "@/lib/apiCall";
import CardNotification from "@/components/home/CardNotification";
// Lấy thông tin thiết bị từ expo-device

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [videos, setVideos] = useState([]);
  const [version, setVersion] = useState<string | null>('');
  const [banners, setBanners] = useState([]);
  const [post, setPost] = useState([]);
  const [lichHen, setLichHen] = useState(null);
  const { user } = useUser();
  const { expoPushToken } = usePushNotifications();
  const [flag, setFlag] = useState<boolean>(false);
  const handleUpdateExpoToken = async (id: any, data: any) => {
    try {
      await updateExpoToken(id, data);
    } catch (error) {
      console.log(error)
    }
  };
  const checkVersion = async () => {
    try {
      const versionData = await getVersion();
      const version = Application.nativeApplicationVersion;  // Phiên bản ứng dụng (ví dụ: "1.2.3")
      const build = Application.nativeBuildVersion;
      if (versionData && versionData.data) {
        console.log(versionData.data.number);
        console.log("version:", version);  // Mã build (ví dụ: "123")
        console.log("build:", build);  //
        if (version != versionData.data.number) {
          if (Platform.OS === "android") {
            setVersion(versionData.data.number);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchVideoData();
    fetchBannerData();
    fetchNews();
    checkVersion();
    if (user && expoPushToken) {
      handleUpdateExpoToken(user.id, expoPushToken.data);
    }
    if (user) {
      fetchLichHen(user.id);
    }
  }, [user, expoPushToken]);
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
            showToast(closestAppointment.ngay_kham);
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
  const showToast = (lichHen: string | number | Date | null) => {
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
        {
          version != ''
            ?
            <CardNotification flag={false} setFlag={setFlag} version={version?version:""} />
            :
            null
        }
        <BannerSlide banners={banners} type={1} />
        <FunctionItemsList schedule={lichHen ? lichHen : null} flag={flag} setFlag={setFlag} />
        <TimeTracking lichHen={lichHen ? lichHen : null} schedule={lichHen ? formatDate(lichHen, 'minimize') : 0} totalTime={user && user.ngay_gan_mc != null ? calculateDaysDifference(user.ngay_gan_mc) : 0} flag={flag} setFlag={setFlag} />
        <RenderVideo videos={videos} flag={flag} setFlag={setFlag} />
        <NewsSection post={post} flag={flag} setFlag={setFlag} />
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
