import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import useUser from '@/hooks/auth/useUser';
import { icons } from '@/constants';
import { router } from 'expo-router';
import { getLichSuTroChuyen, getLoiDan } from '@/lib/apiCall';
import { formatDate } from '@/lib/commonFunctions';
export default function LoiDanScreen() {
  const { user } = useUser();
  const [loiDan, setLoiDan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [flag, setFlag] = useState<boolean>(false);
  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    if (user) {
      const userId = user.id;
      await fetchLoiDan(userId);
    }
    setRefreshing(false);
  };
  const handleTruncate = (title: string) => {
    const truncatedTitle = title && title.length > 80 ? `${title.slice(0, 80)}...` : title;
    return truncatedTitle;
  }
  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetchLoiDan(userId);
    }
  }, [user]);
  const fetchLoiDan = async (userId: number) => {
    try {
      const loiDanData = await getLoiDan(userId);
      setTimeout(() => {
        if (loiDanData) {
          setLoiDan(loiDanData.data);
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
  const handlePress = (chinh_nha_chi_tiet_id: any, ngay_chinh_nha: any, loi_dan: any, id: number) => {
    const title = `Chỉnh nha ngày ${formatDate(ngay_chinh_nha, "minimize")}`;
    setFlag(true);
    router.push({
      pathname: "(routes)/chinh-nha/chinhNhaDetail",
      params: {
        headerTitle: title,
        thu_thuat_dieu_tri: chinh_nha_chi_tiet_id ? chinh_nha_chi_tiet_id.thu_thuat_dieu_tri : null,
        qua_trinh_image_id: chinh_nha_chi_tiet_id ? JSON.stringify(chinh_nha_chi_tiet_id.qua_trinh_image_id) : null,
        tinh_trang_rang_mieng: loi_dan ? JSON.stringify(loi_dan) : null,
        chinh_nha_id: id
      },
    });
    setTimeout(() => {
      setFlag(false)
    }, 1000);
  }
  return (
    <ScrollView className='bg-white flex-1' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className='px-[17px]'>
        {!loading
          ?
          loiDan && loiDan.length != 0
            ?
            loiDan.map((item: LoiDan, index: number) => {
              const isLastItem = index === loiDan.length - 1;
              return (
                <TouchableOpacity disabled={flag} key={index} onPress={() => handlePress(item.chinh_nha_id.chinh_nha_chi_tiet_id, item.chinh_nha_id.ngay_chinh_nha, item, item.chinh_nha_id.id)}
                  className={`my-[7px] mt-[14px] rounded-[7px] bg-[#F5F5F5] p-[10px] ${isLastItem ? 'mb-5' : ''}`} style={styles.boxShadow}>
                  <View className={`flex-row items-center justify-center flex-wrap ${item.seen === 1 ? 'opacity-50' : ''}`}>
                    <View className='w-[80%] items-start'>
                      <Text className={`text-red-500 font-pbold text-[14px]`}>{item.tieu_de}</Text>
                    </View>
                    <View className='w-[20%] items-end'>
                      <Text className='text-[#6C6C6C] font-pmedium text-[10px]'>1ph trước</Text>
                    </View>
                  </View>
                  <View className={`flex-row items-center justify-center flex-wrap ${item.seen === 1 ? 'opacity-50' : ''}`}>
                    <View className='w-[85%]'>
                      <Text className='font-pregular text-[12px]'>{handleTruncate(item.noi_dung)}</Text>
                    </View>
                    <View className='w-[15%] items-center'>
                      <Image source={item.seen === 1 ? icons.circle : icons.circleActive} resizeMode='cover' className={`w-[13px] h-[13px] right-[-6.5px]`} />
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }
            )
            :
            <View className='justify-center items-center h-96'>
              <Text>Không có dữ liệu trò chuyện</Text>
            </View>
          :
          <View className="h-64 justify-center">
            <ActivityIndicator />
          </View>
        }

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  }
});