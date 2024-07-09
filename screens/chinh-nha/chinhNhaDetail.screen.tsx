import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ThuThuat from '@/components/chinh-nha/ThuThuat';
import CustomHeader from '@/components/common/CustomHeader';
import { useRoute } from '@react-navigation/native';
import { getChinhNhaChiTiet } from '@/lib/apiCall';
import QuaTrinhImage from '@/components/chinh-nha/QuaTrinhImage';
import TinhTrang from '@/components/chinh-nha/TinhTrang';
import LoiDan from '@/components/chinh-nha/LoiDan';

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
                }, 1000);
            } else {
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    }
    return (
        <>
            <CustomHeader title={headerTitle} customStyle="bg-transparent" />
            {
                !loading
                    ?
                    <FlatList
                        className=' px-[11px] bg-white'
                        data={[{ key: 'thu-thuat' },{ key: 'hinh-anh' }, { key: 'tinh-trang' }, { key: 'loi-dan' }]}
                        renderItem={({ item }) => {
                            switch (item.key) {
                                case 'thu-thuat':
                                    return <ThuThuat thuthuat={chinhNhaData?.thu_thuat_dieu_tri} />;
                                case 'hinh-anh':
                                    return <QuaTrinhImage
                                        anh={chinhNhaData?.qua_trinh_image_id}
                                    />;
                                case 'tinh-trang':
                                    return <TinhTrang tinhtrang={chinhNhaData?.tinh_trang_rang_mieng} />;
                                case 'loi-dan':
                                    return <LoiDan chinh_nha_chi_tiet_id={chinh_nha_chi_tiet_id} />;
                                default:
                                    return null;
                            }
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                    :
                    <View className="bg-[#FAFAFA] h-full justify-center">
                        <ActivityIndicator />
                    </View>
            }
        </>

    )
}