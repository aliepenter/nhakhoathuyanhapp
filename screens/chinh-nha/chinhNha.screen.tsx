import { View, Text, Image, RefreshControl, ActivityIndicator, ScrollView, Platform, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getChinhNha } from '@/lib/apiCall';
import useUser from '@/hooks/auth/useUser';
import { router } from 'expo-router';
import { formatDate, formatISODateToAMPM } from '@/lib/commonFunctions';
import { icons } from '@/constants';
export default function ChinhNhaScreen() {
  const { user } = useUser();
  const [chinhNha, setChinhNha] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [flag, setFlag] = useState<boolean>(false);
  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    if (user) {
      const userId = user.id;
      await fetchChinhNha(userId);
    }
    setRefreshing(false);
  };
  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetchChinhNha(userId);
    }
  }, [user]);
  const fetchChinhNha = async (userId: number) => {
    try {
      const chinhNhaData = await getChinhNha(userId);
      setTimeout(() => {
        if (chinhNhaData) {
          setChinhNha(chinhNhaData.data);
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

  const handlePress = (item: ChinhNha) => {
    const title = `Chỉnh nha ngày ${formatDate(item.ngay_chinh_nha, "minimize")}`;
    setFlag(true);
    router.push({
      pathname: "/(routes)/chinh-nha/chinhNhaDetail",
      params: {
        headerTitle: title,
        thu_thuat_dieu_tri: item.thu_thuat_dieu_tri ? item.thu_thuat_dieu_tri : null,
        qua_trinh_image_id: item.qua_trinh_image_id ? JSON.stringify(item.qua_trinh_image_id) : null,
        tinh_trang_rang_mieng: item.loi_dan_id ? JSON.stringify(item.loi_dan_id) : null,
        chinh_nha_id: item.id
      },
    });
    setTimeout(() => {
      setFlag(false)
    }, 1000);
  }
  return (
    <ScrollView className="bg-[#F5F5F5] h-full px-[11px]" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {!loading
        ?
        chinhNha && chinhNha.length != 0
          ?
          chinhNha.map((item: ChinhNha, index: number) => (
            index !== chinhNha.length
              ?
              <Pressable
                key={index}
                className={`flex-row items-center h-20`}
                disabled={flag}
                onPress={() => handlePress(item)}
              >
                <View className='justify-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'>
                  <Text className='font-pregular text-[14px] text-[#111111]'>{formatDate(item.ngay_chinh_nha, "day")}</Text>
                  <Text className='font-pregular text-[12px] text-[#757575]'>Tháng {formatDate(item.ngay_chinh_nha, "month")}</Text>
                  <Text className='font-pregular text-[12px] text-[#757575]'>{formatDate(item.ngay_chinh_nha, "year")}</Text>
                  <Image source={icons.circle} resizeMode='cover' className={`${Platform.OS === 'ios' ? 'top-[56%]' : 'top-[60%]'} w-[13px] h-[13px] absolute right-[-6.5px]`} />
                </View>
                <View className={`${Platform.OS === 'ios' ? 'h-[90%]' : ''} w-[80%] items-end justify-center`}>
                  <View className='bg-white w-[95%] h-[80%] rounded-[4px] border-l-[6px] border-[#51B81A]'>
                    <View className='justify-center items-end h-[35%] w-[98%]'>
                      <Text className='font-pregular text-[10px]'>{formatISODateToAMPM(item.ngay_chinh_nha)}</Text>
                    </View>
                    <View className='justify-start ml-2 h-[65%]'>
                      <Text className='font-pregular text-[14px]'>Chỉnh nha tại {item.branch_id.ten_chi_nhanh}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
              :
              <View className='h-4' key={index}>
                <View className='items-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'></View>
              </View>
          ))
          :
          <View className='justify-center items-center h-96'>
            <Text>Không có dữ liệu chỉnh nha</Text>
          </View>
        :
        <View className="h-64 justify-center">
          <ActivityIndicator color={'#00E5E5'} />
        </View>
      }
    </ScrollView>
  )
}