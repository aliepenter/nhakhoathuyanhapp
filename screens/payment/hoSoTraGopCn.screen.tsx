import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { calculatePaymentDetails, formatDate, formatMoney } from '@/lib/commonFunctions'
import useUser from '@/hooks/auth/useUser';
import { getHoSoTraGopCn, getLichSuThanhToanCn } from '@/lib/apiCall';
interface PaymentState {
  so_tien_da_thanh_toan: number;
  so_tien_con_lai: number;
  so_tien_can_tra_ki_toi: number;
  ngay_den_han_thanh_toan: string;
}
export default function HoSoTraGopCnScreen() {
  const { user } = useUser();
  const [hoSoTraGopCn, setHoSoTraGopCn] = useState<HoSoTraGopCn>();
  const [lichSuThanhToanCn, setLichSuThanhToanCn] = useState<Array<LichSuThanhToan>>();
  const [loading2, setLoading2] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [thongTinThanhToan, setThongTinThanhToan] = useState<PaymentState>();
  const onRefresh = async () => {
    setRefreshing(true);
    setLoading2(true);
    if (user) {
      const userId = user.id;
      await fetchHoSoTraGopCn(userId);
      if (hoSoTraGopCn) {
        await fetchLichSuThanhToanCn(hoSoTraGopCn);
      }
    }
    setRefreshing(false);
  };
  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetchHoSoTraGopCn(userId);
    }
  }, [user]);
  const fetchHoSoTraGopCn = async (userId: number) => {
    try {
      const hoSoTraGopCnData = await getHoSoTraGopCn(userId);
      if (hoSoTraGopCnData) {
        setHoSoTraGopCn(hoSoTraGopCnData.data);
        fetchLichSuThanhToanCn(hoSoTraGopCnData.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchLichSuThanhToanCn = async (hstgcn: HoSoTraGopCn) => {
    try {
      const lsttcn = await getLichSuThanhToanCn(hstgcn.id.toString());
      setTimeout(() => {
        if (lsttcn) {
          const calculatedData = calculatePaymentDetails(hstgcn.tong_so_tien, hstgcn.so_tien_can_tra_ki_toi, lsttcn.data);
          setThongTinThanhToan(calculatedData)
          setLichSuThanhToanCn(lsttcn.data);
          setLoading2(false)
        } else {
          setLoading2(false)
        }
      }, 200);

    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => {
        setLoading2(false)
      }, 200);
    }
  };

  return (
    <View className='mt-[22px]'>
      <View className='px-[11px]'>
        <Text className='font-psemibold text-[20px]'>Chi tiết thanh toán</Text>
      </View>
      <View className='mt-[6px]'>
        <View className='mb-[23px] px-[11px]'>
          {
            !loading2
              ?
              hoSoTraGopCn
                ?
                <View>
                  <View className='flex-row border-b-[1px] border-[#E9E9E9] pb-[10px] pt-[9px]'>
                    <View className='w-[50%]'>
                      <Text className='font-pregular text-[12px]'>Tổng số tiền cần thanh toán</Text>
                      <Text className='mt-1 font-pbold text-[14px] text-[#666666]'>{formatMoney(hoSoTraGopCn.tong_so_tien)}</Text>
                    </View>
                    <View className='w-[50%]'>
                      <Text className='font-pregular text-[12px]'>Ngày bắt đầu thanh toán</Text>
                      <Text className='mt-1 font-pregular text-[14px] text-[#666666]'>{formatDate(hoSoTraGopCn.ngay_bat_dau_thanh_toan, 'minimize')}</Text>
                    </View>
                  </View>
                  <View className='flex-row border-b-[1px] border-[#E9E9E9] pb-[10px] pt-[9px]'>
                    <View className='w-[50%]'>
                      <Text className='font-pregular text-[12px]'>Tổng số tiền đã thanh toán</Text>
                      <Text className='mt-1 font-pbold text-[14px] text-[#FF0000]'>{thongTinThanhToan ? formatMoney(thongTinThanhToan.so_tien_da_thanh_toan) : 0}</Text>
                    </View>
                    <View className='w-[50%]'>
                      <Text className='font-pregular text-[12px]'>Số tiền còn lại</Text>
                      <Text className='mt-1 font-pbold text-[14px] text-[#FF0000]'>{thongTinThanhToan ? formatMoney(thongTinThanhToan.so_tien_con_lai) : 0}</Text>
                    </View>
                  </View>
                  <View className='flex-row pt-[9px]'>
                    <View className='w-[50%]'>
                      <Text className='font-pregular text-[12px]'>Số tiền cần trả kỳ tới</Text>
                      <Text className='mt-1 font-pbold text-[14px] text-[#666666]'>{thongTinThanhToan ? formatMoney(thongTinThanhToan.so_tien_can_tra_ki_toi) : 0}</Text>
                    </View>
                    <View className='w-[50%]'>
                      <Text className='font-pregular text-[12px]'>Ngày đến hạn thanh toán</Text>
                      <Text className='mt-1 font-pregular text-[14px] text-[#666666]'>{thongTinThanhToan ? formatDate(thongTinThanhToan.ngay_den_han_thanh_toan, 'minimize') : 0}</Text>
                    </View>
                  </View>
                </View>
                :
                <View className={`${Platform.OS === 'ios' ? 'h-[156px]' : 'h-[187px]'} justify-center items-center`}>
                  <Text>Không có dữ liệu thanh toán</Text>
                </View>
              :
              <View className={`${Platform.OS === 'ios' ? 'h-[156px]' : 'h-[187px]'} justify-center`}>
                <ActivityIndicator color={'#00E5E5'} />
              </View>
          }
        </View>
        <View>
          <View className='flex-row justify-between items-center px-[11px]'>
            <Text className='font-psemibold text-[20px]'>Lịch sử thanh toán</Text>
            {!loading2 ?
              lichSuThanhToanCn && lichSuThanhToanCn.length != 0
                ?
                <Text className='text-[#737373] italic'>{lichSuThanhToanCn.length} giao dịch</Text>
                :
                <></>
              :
              <View className="w-24 h-[18px] items-center justify-center">
                <ActivityIndicator color={'#00E5E5'} />
              </View>
            }
          </View>

          <View className='mt-[11px] px-[11px]'>
            <View className='flex-row'>
              <View className='w-[33.333333333%]'>
                <Text className='font-pregular text-[12px]'>Ngày thanh toán</Text>
              </View>
              <View className='w-[33.333333333%] items-center'>
                <Text className='font-pregular text-[12px]'>Số tiền</Text>
              </View>
              <View className='w-[33.333333333%] items-center'>
                <Text className='font-pregular text-[12px]'>Trạng thái</Text>
              </View>
            </View>
          </View>
          <ScrollView className={`${Platform.OS === 'ios' ? 'h-[57%]' : 'h-[47%]'} mt-[7px]`} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {!loading2 ?
              lichSuThanhToanCn && lichSuThanhToanCn.length != 0
                ?
                lichSuThanhToanCn.map((item: LichSuThanhToan, index: number) => (
                  <View key={index} className={`${index % 2 === 0 ? "bg-[#F3F3F3]" : "bg-white"} h-10 justify-center items-center px-[11px]`}>
                    <View className='flex-row'>
                      <View className='w-[33.333333333%] justify-center'>
                        <Text className='font-pregular text-[12px]'>{formatDate(item.ngay_thanh_toan, 'minimize')}</Text>
                      </View>
                      <View className='w-[33.333333333%] items-center justify-center'>
                        <Text className='font-pbold text-[14px] text-[#FF0000]'>{formatMoney(item.so_tien)}</Text>
                      </View>
                      <View className='w-[33.333333333%] items-center justify-center'>
                        <View className='bg-[#5CB820] rounded-[3px] w-[70%] h-[70%] justify-center items-center'>
                          <Text className='font-pbold text-[10px] text-[#FFFFFF]'>Đã thanh toán</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
                :
                <View className='justify-center items-center h-56'>
                  <Text>Không có dữ liệu lịch sử thanh toán</Text>
                </View>
              :
              <View className="h-56 justify-center">
                <ActivityIndicator color={'#00E5E5'} />
              </View>
            }
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
