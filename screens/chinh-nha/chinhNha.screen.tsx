import { View, Text, RefreshControl, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { formatDate, getChinhNha } from '@/lib/apiCall';
import useUser from '@/hooks/auth/useUser';
import { router } from 'expo-router';

export default function ChinhNhaScreen() {
  const { user } = useUser();
  const [chinhNha, setChinhNha] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const handlePress = (chinh_nha_chi_tiet_id: any, co_so: any, ngay_chinh_nha: any) => {
    const title = `Chỉnh nha ngày ${formatDate(ngay_chinh_nha)}`;
    router.push({
      pathname: "(routes)/chinh-nha/chinhNhaDetail",
      params: {  headerTitle: title, chinh_nha_chi_tiet_id: chinh_nha_chi_tiet_id },
    });
  }
  return (
    <ScrollView className="bg-white h-full" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {!loading
        ?
        chinhNha && chinhNha.length != 0
          ?
          chinhNha.map((item: ChinhNha, index: number) => (
            <TouchableOpacity
              key={index}
              className={`${index % 2 !== 0 ? "bg-[#F3F3F3]" : "bg-white"} px-[11px] py-[20px] md:py-[30px]`}
              activeOpacity={0.7}
              onPress={() => handlePress(item.chinh_nha_chi_tiet_id, item.branch_id.ten_chi_nhanh, item.ngay_chinh_nha)}
            >
              <Text className='text-[14px] md:text-[20px]'>{`Ngày ${formatDate(item.ngay_chinh_nha)}, ${item.branch_id.ten_chi_nhanh}`}</Text>
            </TouchableOpacity>
          ))
          :
          <View className='justify-center items-center h-96'>
            <Text>Không có dữ liệu chỉnh nha</Text>
          </View>
        :
        <View className="h-96 justify-center">
          <ActivityIndicator />
        </View>
      }
    </ScrollView>
  )
}