import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import VideoSection from '../common/VideoSection'
import { getVideoCategoryById } from '@/lib/apiCall';

export default function LoiDan({chinh_nha_chi_tiet_id}: any) {
    const [videoCategory, setVideoCategory] = useState<Array<any>>([]);
    
    useEffect(() => {
        fetchVideoCategory();
    }, [chinh_nha_chi_tiet_id]);
    const fetchVideoCategory = async () => {
        try {
            if (chinh_nha_chi_tiet_id) {
                const res = await getVideoCategoryById(chinh_nha_chi_tiet_id);
                setTimeout(() => {
                    if (res) {
                        setVideoCategory(res.data);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    return (
        <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9]'>
            <Text className='text-[16px] font-pbold text-[#5EBA1B] mb-[4px]'>4. Lời dặn sau điều trị</Text>
            <FlatList
            className='mt-[10px]'
                data={videoCategory}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <VideoSection item={item.video_id} isLast={index === videoCategory.length - 1} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}