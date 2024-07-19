import { View, Text, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getDichVuKhac } from '@/lib/apiCall';
import { formatMoney } from '@/lib/commonFunctions';

export default function DichVuKhac({ chinh_nha_id }: any) {
    const [dichVuKhac, setDichVuKhac] = useState<Array<any>>([]);
    const [has, setHas] = useState<boolean>(true);
    useEffect(() => {
        fetchDichVuKhac();
    }, [chinh_nha_id]);
    const fetchDichVuKhac = async () => {
        try {
            if (chinh_nha_id) {
                const res = await getDichVuKhac(chinh_nha_id);
                setTimeout(() => {
                    if (res) {
                        setDichVuKhac(res.data);
                        if (res.data.length === 0) {
                            setHas(false)
                        }
                    }
                }, 500);
            } else {
                setHas(false)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setHas(false);
        }
    }
    return (
        <>
            <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9] md:pb-[20px]'>
                <Text className='text-[16px] md:text-[22px] font-pbold text-[#5EBA1B] mb-[4px] md:mb-[13px]'>5. Chi phí dịch vụ khác</Text>
                {
                    has ?
                        <DichVuKhacListItem dichVuKhac={dichVuKhac} />
                        :
                        <View className={`flex justify-center items-center`}>
                            <Text className={`text-[14px] md:text-[20px] ml-5`}>Không sử dụng dịch vụ khác</Text>
                        </View>
                }
            </View>

        </>

    )
}

const DichVuKhacListItem = ({ dichVuKhac }: any) => {

    return <>
        {
            dichVuKhac && dichVuKhac.length != 0
                ?
                <ScrollView
                    className='mt-[10px]'
                >
                    {
                        dichVuKhac.map((item: any, index: number) => (
                            <DichVuKhacItem key={index} item={item} />
                        ))
                    }
                </ScrollView>
                :
                <View className={`justify-center`}>
                    <ActivityIndicator />
                </View>
        }
    </>
}

const DichVuKhacItem = ({ item }: any) => {
    return (
        <View className='bg-[#F3F3F3] py-5 mb-[7px] px-5'>
            <Text className='text-[14px]'>- {item.ten_dich_vu}: <Text className='text-[#FF0000]'>{formatMoney(item.gia_thanh)}</Text></Text>
        </View>
    )
}