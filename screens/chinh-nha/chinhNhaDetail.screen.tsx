import { View, Text, FlatList, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThuThuat from '@/components/chinh-nha/ThuThuat';
import CustomHeader from '@/components/common/CustomHeader';
import { useRoute } from '@react-navigation/native';
import { getChinhNhaChiTiet } from '@/lib/apiCall';
import QuaTrinhImage from '@/components/chinh-nha/QuaTrinhImage';
import TinhTrang from '@/components/chinh-nha/TinhTrang';
import LoiDan from '@/components/chinh-nha/LoiDan';
import DichVuKhac from '@/components/chinh-nha/DichVuKhac';
import DanhGiaDichVu from '@/components/chinh-nha/DanhGiaDichVu';

export default function ChinhNhaDetailScreen() {
    const route = useRoute();
    const { chinh_nha_chi_tiet_id, headerTitle }: any = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chinhNhaData, setChinhNhaData] = useState<ChinhNhaChiTiet>();
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchData();
        setRefreshing(false);
    }
    useEffect(() => {
        fetchData();
    }, [chinh_nha_chi_tiet_id]);


    const fetchData = async () => {
        try {
            if (chinh_nha_chi_tiet_id) {
                const res = await getChinhNhaChiTiet(chinh_nha_chi_tiet_id);
                setTimeout(() => {
                    if (res) {
                        setChinhNhaData(res.data);
                        setLoading(false);
                    } else {
                        setLoading(false);
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 500);
        }
    }
    return (
        <>
            <CustomHeader title={headerTitle} customStyle="bg-transparent" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                className='flex-1'
            >
                {
                    !loading
                        ?
                        <ScrollView
                            className='px-[11px] bg-white'
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <ThuThuat thuthuat={chinhNhaData?.thu_thuat_dieu_tri} />
                            <QuaTrinhImage anh={chinhNhaData?.qua_trinh_image_id} />
                            <TinhTrang tinhtrang={chinhNhaData?.tinh_trang_rang_mieng} />
                            <LoiDan chinh_nha_chi_tiet_id={chinh_nha_chi_tiet_id} />
                            <DichVuKhac chinh_nha_chi_tiet_id={chinh_nha_chi_tiet_id} />
                            <DanhGiaDichVu />
                        </ScrollView>
                        
                        :
                        <View className="bg-[#FAFAFA] h-full justify-center">
                            <ActivityIndicator />
                        </View>
                }
            </KeyboardAvoidingView>
        </>

    )
}