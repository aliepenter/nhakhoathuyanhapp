import { View, Text, FlatList, ActivityIndicator, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import VideoSection from '../common/VideoSection'
import { getBaiVietCategoryById, getVideoCategoryById } from '@/lib/apiCall';
import BaiVietSection from '../common/BaiVietSection';
import { router } from 'expo-router';
type LoiDanProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    chinh_nha_id: any;
}
export default function LoiDan({ chinh_nha_id, flag, setFlag }: LoiDanProps) {
    const [videoCategory, setVideoCategory] = useState<Array<any>>([]);
    const [baiVietCategory, setBaiVietCategory] = useState<Array<any>>([]);
    const [hasVideo, setHasVideo] = useState<boolean>(true);
    const [hasBaiViet, setHasBaiViet] = useState<boolean>(true);

    useEffect(() => {
        fetchVideoCategory();
        fetchBaiVietCategory();
    }, [chinh_nha_id]);
    const fetchVideoCategory = async () => {
        try {
            if (chinh_nha_id) {
                const res = await getVideoCategoryById(chinh_nha_id);
                setTimeout(() => {
                    if (res) {
                        setVideoCategory(res.data);
                        if (res.data.length === 0) {
                            setHasVideo(false)
                        }
                    }
                }, 500);
            } else {
                setHasVideo(false)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setHasVideo(false);
        }
    }

    const fetchBaiVietCategory = async () => {
        try {
            if (chinh_nha_id) {
                const res = await getBaiVietCategoryById(chinh_nha_id);
                setTimeout(() => {
                    if (res) {
                        setBaiVietCategory(res.data);
                        if (res.data.length === 0) {
                            setHasBaiViet(false)
                        }
                    }
                }, 500);
            } else {
                setHasBaiViet(false)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setHasBaiViet(false);
        }
    }
    return (
        <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9] md:pb-[20px]'>
            <Text className='text-[16px] md:text-[22px] font-pbold text-[#5EBA1B]'>4. Lời dặn sau điều trị</Text>
            {
                (hasVideo || hasBaiViet) ? (
                    <View>
                        {hasVideo && (
                            <View className='mt-[17px] md:mt-[20px]'>
                                <Text className='text-[#626262] text-[14px] font-psemibold'>Lời dặn bằng video</Text>
                                {
                                    videoCategory && videoCategory.length != 0
                                        ?
                                        <ScrollView
                                            horizontal
                                            className='mt-[10px]'
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            {
                                                videoCategory.map((item: any, index: number) => (
                                                    <VideoSection flag={flag} setFlag={setFlag} key={index} customImageStyle={`${videoCategory.length === 1 ? "w-96 h-56" : ''}`} item={item.video_id} isLast={index === videoCategory.length - 1} />
                                                )
                                                )
                                            }
                                        </ScrollView>
                                        :
                                        <View className={`${videoCategory.length === 1 ? "h-[234px]" : 'h-[202px]'} justify-center`}>
                                            <ActivityIndicator color={'#00E5E5'} />
                                        </View>
                                }
                            </View>
                        )}
                        {hasBaiViet && (
                            <View className='mt-[17px] md:mt-[20px]'>
                                <Text className='text-[#626262] text-[14px] font-psemibold'>Lời dặn bằng bài viết</Text>
                                {
                                    baiVietCategory && baiVietCategory.length != 0
                                        ?
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            className='mt-[10px]'
                                        >
                                            {
                                                baiVietCategory.map((item: any, index: number) => (
                                                    <BaiVietSection flag={flag} setFlag={setFlag} key={index} customImageStyle={`${baiVietCategory.length === 1 ? "w-96 h-56" : ''}`} item={item.bai_viet_id} isLast={index === baiVietCategory.length - 1} />
                                                ))
                                            }
                                        </ScrollView>
                                        :
                                        <View className={`${baiVietCategory.length === 1 ? "h-[234px]" : 'h-[160px]'} justify-center`}>
                                            <ActivityIndicator color={'#00E5E5'} />
                                        </View>
                                }
                            </View>
                        )}
                    </View>
                ) : (
                    <View className={`flex justify-center items-center`}>
                        <Text className={`text-[14px] md:text-[20px] ml-5`}>Không có lời dặn</Text>
                    </View>
                )
            }
        </View >
    )
}

