import { View, Text, FlatList, RefreshControl, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getChinhNha } from '@/lib/apiCall';
import useUser from '@/hooks/auth/useUser';

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

  const formatDate = (isoDateString: any) => {
    const date = new Date(isoDateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
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
              className={`${index % 2 !== 0 ? "bg-[#F3F3F3]" : "bg-white"} px-[11px] py-[20px]`}
              activeOpacity={0.7}
              onPress={() => { }}
            >
              <Text className='text-[14px]'>{`Ngày ${formatDate(item.ngay_chinh_nha)}, ${item.branch_id.ten_chi_nhanh}`}</Text>
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