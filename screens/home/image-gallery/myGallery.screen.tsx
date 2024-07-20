import { View, Text, ActivityIndicator, ScrollView, RefreshControl, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Swiper from 'react-native-swiper'
import { SERVER_URL } from '@/utils/uri'
import { LinearGradient } from 'expo-linear-gradient'
import { formatDate } from '@/lib/commonFunctions'
import CustomButton from '@/components/common/CustomButton'
import { icons } from '@/constants'
import { getCustomerLibrary } from '@/lib/apiCall'
import { Image } from 'expo-image';
import { router } from 'expo-router'
import { useCameraPermissions } from 'expo-camera';

export default function MyGalleryScreen({ user }: any) {
  const [customerLibraryData, setCustomerLibraryData] = useState<Array<CustomerLibrary>>();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    if (user) {
      const userId = user.id;
      await fetchCustomerLibrary(userId);
    }
    setRefreshing(false);
  }
  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetchCustomerLibrary(userId);
    }
  }, [user]);

  const fetchCustomerLibrary = async (userId: number) => {
    try {
      const chinhNhaData = await getCustomerLibrary(userId);
      setTimeout(() => {
        if (chinhNhaData) {
          setCustomerLibraryData(chinhNhaData.data);
          setLoading(false)
        } else {
          setLoading(false)
        }
      }, 1000);

    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  };
  const [permission, requestPermission] = useCameraPermissions();

  const handleCamera = async () => {
    if (permission && permission.granted) {
      router.push({
        pathname: "(routes)/camera",
      });
    } else {
      await requestPermission().then(res => {
        if (res.granted) {
          router.push({
            pathname: "(routes)/camera",
          });
        }
      })
    }
  };
  return (
    <ScrollView
      className='mt-[15px]'
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View>
        <Text className='text-center text-[13px] font-pregular text-[#757575]'>Đây là thư viện ảnh của bạn và không phải là hình ảnh dùng để chia sẻ với phòng khám. Bạn có thể chụp ảnh, lưu trữ tại đây và chia sẻ hành trình thay đổi nụ cười với bạn bè và người thân.</Text>
      </View>
      <View className="mt-[30px]">
        <Text className='text-[12px] font-pregular'><Image className='w-[16px] h-[16px]' source={icons.calenderMonthBlack} /> {customerLibraryData ? formatDate(customerLibraryData[customerLibraryData.length - 1]?.ngay_chup, 'minimize') + " - " + formatDate(customerLibraryData[0]?.ngay_chup, 'minimize') : null} (Chọn ngày chụp)</Text>
      </View>
      <View className="mt-[10px] md:mx-16 md:mt-[20px]">
        {
          !loading
            ?
            customerLibraryData && customerLibraryData.length != 0
              ?
              <Swiper
                showsPagination={true}
                loop={false}
                autoplay={false}
                paginationStyle={{ bottom: -16 }}
                className="h-[400px] md:h-[720px]"
                autoplayTimeout={5}
                pagingEnabled={true}
                dot={
                  <Image
                    source={icons.dot}
                    className="w-[10px] h-[10px] mx-1"
                    contentFit='contain'
                  />
                }
                activeDot={
                  <Image
                    source={icons.dotActive}
                    className="w-[10px] h-[10px] mx-1"
                    contentFit='contain'
                  />
                }
              >
                {customerLibraryData.map((item: CustomerLibrary, index: number) => (

                  <View key={index} className="flex-1 mx-[3px]">
                    <Image
                      source={{ uri: `${SERVER_URL}${item.image_path}` }}
                      className="w-full h-full rounded-[10px]"
                      contentFit='cover'
                    />
                    <LinearGradient
                      colors={["#1560A1", "#4FAA57"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className={`absolute bottom-0 w-full rounded-b-[10px]`}
                    >
                      <Text className='py-[12px] text-center font-psemibold text-[14px] text-white'>Ảnh #{customerLibraryData.length - index} | {formatDate(item.ngay_chup, "full")}</Text>
                    </LinearGradient>
                  </View>
                ))}
              </Swiper>
              :
              <View className='justify-center items-center h-96'>
                <Text className='text-center text-[13px] text-[#757575]'>Bạn chưa có bức ảnh nào, chụp ảnh lưu giữ lại khoảnh khắc thay đổi nụ cười</Text>
              </View>
            :
            <View className="h-[400px] md:h-[720px] justify-center">
              <ActivityIndicator />
            </View>
        }
      </View>
      <View>
        <CustomButton
          title="Chụp ảnh nụ cười hôm nay"
          handlePress={handleCamera}
          containerStyles="mt-[45px]"
          icon={icons.cameraGreen}
          buttonStyle="rounded-full py-[5px] px-[19px] bg-[#EDEDED] border-[#D7D7D7] border-[1px]"
          textStyles="font-pregular text-[12px] md:text-[16px]"
          iconStyle="w-[20px] h-[20px] mr-[6px]"
        />
      </View>
      <View className="h-[270px]"></View>
    </ScrollView>
  )
}