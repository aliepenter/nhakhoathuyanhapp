import { View, Text, ScrollView, RefreshControl, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { formatDate } from '@/lib/commonFunctions';
import { router } from 'expo-router';
import { getAnhQuaTrinh } from '@/lib/apiCall';

export default function QuaTrinhScreen({ user }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [anh, setAnh] = useState<Array<AnhQuaTrinh>>();
  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    if (user) {
      const userId = user.id;
      await fetchAnhQuaTrinh(userId);
    }
    setRefreshing(false);
  };
  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetchAnhQuaTrinh(userId);
    }
  }, [user]);
  const fetchAnhQuaTrinh = async (userId: number) => {
    try {
      const anhData = await getAnhQuaTrinh(userId);
      setTimeout(() => {
        if (anhData) {
          setAnh(anhData.data);
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

  const handlePress = (item: any) => {
    const title = `Ngày ${formatDate(item.ngay_chup, "minimize")}`;
    setFlag(true);
    router.push({
      pathname: "/(routes)/image-gallery",
      params: {
        headerTitle: title,
        title: item.ten_anh,
        anh_1: item.anh_1,
        anh_2: item.anh_2,
        anh_3: item.anh_3,
        anh_4: item.anh_4,
        anh_5: item.anh_5,
        anh_6: item.anh_6,
        anh_7: item.anh_7,
        anh_8: item.anh_8,
        anh_9: item.anh_9,
        anh_10: item.anh_10,
        anh_11: item.anh_11,
        anh_12: item.anh_12,
        anh_13: item.anh_13,
      },
    });
    setTimeout(() => {
      setFlag(false);
    }, 1000);
  }
  return (
    <ScrollView className="bg-white h-full" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {!loading
        ?
        anh && anh.length != 0
          ?
          anh.map((item: AnhQuaTrinh, index: number) => (
            <Pressable
              key={index}
              className={`${index % 2 !== 0 ? "bg-[#F3F3F3]" : "bg-white"} px-[11px] py-[20px] md:py-[30px]`}
              onPress={() => handlePress(item)}
              disabled={flag}
            >
              <Text className='text-[14px] md:text-[20px]'>{`Ngày ${formatDate(item.ngay_chup, "minimize")}: ${item.ten_anh}`}</Text>
            </Pressable>
          ))
          :
          <View className='justify-center items-center h-96'>
            <Text>Không có dữ liệu</Text>
          </View>
        :
        <View className="h-96 justify-center">
          <ActivityIndicator color={'#00E5E5'} />
        </View>
      }
    </ScrollView>
  )
}