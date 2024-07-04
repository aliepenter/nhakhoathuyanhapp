import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StatusBar,
  Text,
  View, StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import CustomButton from "@/components/CustomButton";
import { Link, Redirect, router } from "expo-router";
import { getVideos, logout, getBanners } from "@/lib/apiCall";
import useUser from "@/hooks/auth/useUser";
import { SERVER_URL } from "@/utils/uri";
import Swiper from 'react-native-swiper';
import FunctionItem from "@/components/FunctionItem";
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
  const [banners, setBanners] = useState([]);
  const onRefresh = async () => {
    setRefreshing(true);
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
      <ScrollView className="h-full"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="h-[150px]">
          <ImageBackground source={images.bgHeaderHome} resizeMode='stretch' className='flex-1'>
            <View className="flex-row flex-1 justify-start ml-7 mt-8 items-center">
              <Image source={{ uri: `${SERVER_URL}${user?.anh_dai_dien}` }} resizeMode='contain' className='rounded-[50px] w-[100px] h-[100px]' />
              <View className="ml-6">
                <View className="flex-row items-center">
                  <Text className="text-white text-[14px]">Xin chào, </Text>
                  <Text className="text-white size-[14px] font-pbold">{user?.ho_va_ten}</Text>
                </View>
                <Text className="text-white text-[14px] font-pbold my-1">{user?.so_dien_thoai}</Text>
                <Text className="text-white text-[14px] font-semibold">{user?.dia_chi}</Text>
              </View>
            </View>
            <View className="absolute top-[30%] right-6">
              <View>
                <Image source={icons.notificationHeader} resizeMode='contain' className='w-[20px] h-[21px]' />
                <Image source={icons.notificationHighlight} resizeMode='contain' className='w-[14px] h-[14px] absolute left-2 bottom-3' />
              </View>
            </View>
          </ImageBackground>
        </View>
        {/* Banner slideshow */}
        <View className="mt-[10px] pl-[8px] pr-[8px] mb-[30px]">
          {banners.length != 0
            ?
            <Swiper
              showsPagination={true}
              loop={false}
              autoplay={true}
              paginationStyle={{ bottom: -16 }}
              className="h-[170px]"
            >
              {banners.map((item: Banner, index: number) => (
                item.status === 1
                  ?
                  <View key={index} className="flex-1 ml-[3px] mr-[3px]">
                    <Image
                      source={{ uri: `${SERVER_URL}${item.banner_path}` }}
                      className="w-full h-full rounded-[10px]"
                    />
                  </View>
                  :
                  null
              ))}
            </Swiper>
            :
            <View className="h-[170px] justify-center">
              <ActivityIndicator />
            </View>
          }
        </View>
        {/* Function list */}
        <View className="h-[200px] flex-col justify-between pl-[11px] pr-[11px]">
          <View className="flex-row justify-between">
            <FunctionItem icon={icons.iconChinhNha} title="Chỉnh nha" />
            <FunctionItem icon={icons.iconDatLich} title="Đặt lịch" />
            <FunctionItem icon={icons.iconLichHen} title="Lịch hẹn" />
            <FunctionItem icon={icons.iconThanhToan} title="Thanh toán" />
          </View>
          <View className="flex-row justify-between">
            <FunctionItem icon={icons.iconChiNhanh} title="Chi nhánh" />
            <FunctionItem icon={icons.iconTinTuc} title="Tin tức" />
            <FunctionItem icon={icons.iconHopDong} title="Hợp đồng" />
            <FunctionItem icon={icons.iconLoiDan} title="Lời dặn" />
          </View>
        </View>
        {/* Video nổi bật */}
        <View className="px-[11px] space-y-6 mt-[27px]">
          <View className="w-full flex-1">
            <View className="justify-between items-start flex-row">
              <View className="flex-row">
                <Image source={icons.verticalLine} className='w-[3px] h-[20px] mr-[8px] top-[3px]' resizeMode='contain' />
                <Text className="text-[#5EBA1B] text-[16px] font-pbold mb-3">
                  Video nổi bật
                </Text>
              </View>
              <View className="mt-1.5">
                <Link
                  href="/sign-up"
                  className="text-[12px] font-pregular text-[#FF2D2D]"
                >
                  Xem tất cả
                </Link>
              </View>
            </View>
            {videos.length != 0
              ?
              <Trending posts={videos ?? []} />
              :
              <View className="h-48 justify-center">
                <ActivityIndicator />
              </View>
            }
          </View>
        </View>
        {/* Last section */}
        <View className="mb-[100px] px-[11px] space-y-6 mt-[27px]">
          <View className="w-full flex-1">
            <View className="justify-between items-start flex-row">
              <View className="flex-row">
                <Image source={icons.verticalLine} className='w-[3px] h-[20px] mr-[8px] top-[3px]' resizeMode='contain' />
                <Text className="text-[#5EBA1B] text-[16px] font-pbold mb-3">
                  Tin tức nổi bật
                </Text>
              </View>
              <View className="mt-1.5">
                <Link
                  href="/sign-up"
                  className="text-[12px] font-pregular text-[#FF2D2D]"
                >
                  Xem tất cả
                </Link>
              </View>
            </View>
            {banners.length != 0
              ?
              <View className="flex-wrap flex-row justify-between">

                {banners.map((item: Banner, index: number) => (
                  item.status === 2
                    ?
                    <Image
                      key={index}
                      source={{ uri: `${SERVER_URL}${item.banner_path}` }}
                      className="h-[142px] w-[49%] rounded-[10px] mb-5"
                    />
                    :
                    null
                ))}
              </View>
              :
              <View className="h-[142px] justify-center">
                <ActivityIndicator />
              </View>
            }

          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
