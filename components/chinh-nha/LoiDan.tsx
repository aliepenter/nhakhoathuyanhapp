import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import VideoSection from '../common/VideoSection'
import { getBaiVietCategoryById, getVideoCategoryById } from '@/lib/apiCall';

export default function LoiDan({ chinh_nha_chi_tiet_id }: any) {
    const [videoCategory, setVideoCategory] = useState<Array<any>>([]);
    const [hasVideo, setHasVideo] = useState<boolean>(true);

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
                        if (res.data.length === 0) {
                            setHasVideo(false)
                        }
                    }
                }, 1000);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setHasVideo(false);
        }
    }
    return (
        <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9] md:pb-[20px]'>
            <Text className='text-[16px] md:text-[22px] font-pbold text-[#5EBA1B] mb-[4px] md:mb-[13px]'>4. Lời dặn sau điều trị</Text>
            {
                chinh_nha_chi_tiet_id && hasVideo
                    ?
                    <View>
                        <VideoLoiDanItem videoCategory={videoCategory} />
                    </View>
                    :
                    <View className={`flex justify-center items-center`}>
                        <Text className={`text-[14px] md:text-[20px] ml-5`}>Không có dữ liệu</Text>
                    </View>
            }

        </View>
    )
}

const VideoLoiDanItem = ({ videoCategory }: any) => {
    return <>
        {
            videoCategory && videoCategory.length != 0
                ?
                <FlatList
                    className='mt-[10px]'
                    data={videoCategory}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <VideoSection customImageStyle={`${videoCategory.length === 1 ? "w-96 h-56" : ''}`} item={item.video_id} isLast={index === videoCategory.length - 1} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
                :
                <View className="h-48 justify-center">
                    <ActivityIndicator />
                </View>
        }
    </>

}