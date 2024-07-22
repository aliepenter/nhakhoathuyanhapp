import { View, Text, ActivityIndicator, ScrollView, RefreshControl, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { formatDate, formatMoney } from '@/lib/commonFunctions';
import { getLichSuThanhToanDvk } from '@/lib/apiCall';
import useUser from '@/hooks/auth/useUser';

export default function DichVuKhacScreen() {
    const { user } = useUser();
    const [lichSuThanhToanDvk, setLichSuThanhToanDvk] = useState<Array<LichSuThanhToan>>();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        if (user) {
            const userId = user.id;
            await fetchLichSuThanhToanDvk(userId);
        }
        setRefreshing(false);
    };
    useEffect(() => {
        if (user) {
            const userId = user.id;
            fetchLichSuThanhToanDvk(userId)
        }
    }, [user]);

    const fetchLichSuThanhToanDvk = async (userId: number) => {
        try {
            const lsttcn = await getLichSuThanhToanDvk(userId);
            setTimeout(() => {
                if (lsttcn) {
                    setLichSuThanhToanDvk(lsttcn.data);
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
    return (
        <View className='mt-[22px]'>
            <View className='flex-row justify-between items-center px-[11px]'>
                <Text className='font-psemibold text-[20px]'>Lịch sử thanh toán</Text>
                {!loading ?
                    lichSuThanhToanDvk && lichSuThanhToanDvk.length != 0
                        ?
                        <Text className='text-[#737373] italic'>{lichSuThanhToanDvk.length} giao dịch</Text>
                        :
                        <></>
                    :
                    <View className="w-24 h-[18px] items-center justify-center">
                        <ActivityIndicator />
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
            <ScrollView className={`h-[80%] mt-[7px]`} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {!loading ?
                    lichSuThanhToanDvk && lichSuThanhToanDvk.length != 0
                        ?
                        lichSuThanhToanDvk.map((item: LichSuThanhToan, index: number) => (
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
                        <ActivityIndicator />
                    </View>
                }
            </ScrollView>
        </View>
    )
}