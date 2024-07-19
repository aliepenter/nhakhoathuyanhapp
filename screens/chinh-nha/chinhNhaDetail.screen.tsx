import { View, Text, FlatList, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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
    const {
        thu_thuat_dieu_tri,
        qua_trinh_image_id,
        tinh_trang_rang_mieng,
        headerTitle,
        chinh_nha_id
    }: any = route.params;
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chinhNhaData, setChinhNhaData] = useState<ChinhNhaChiTiet>();
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchData();
        setRefreshing(false);
    }
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };
    useEffect(() => {
        fetchData();
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                scrollToBottom();
            }
        );
        return () => {
            keyboardDidShowListener.remove();
        };
    }, [chinh_nha_id]);


    const fetchData = async () => {
        try {
            if (chinh_nha_id) {
                const res = await getChinhNhaChiTiet(chinh_nha_id);
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
                className='flex-1'
            >
                {
                    !loading
                        ?
                        <ScrollView
                            ref={scrollViewRef}
                            className={`px-[11px] bg-white`}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >

                            <ThuThuat thuthuat={thu_thuat_dieu_tri} />
                            <QuaTrinhImage anh={qua_trinh_image_id} />
                            <TinhTrang tinhtrang={tinh_trang_rang_mieng} />
                            <LoiDan chinh_nha_id={chinh_nha_id} />
                            <DichVuKhac chinh_nha_id={chinh_nha_id} />
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