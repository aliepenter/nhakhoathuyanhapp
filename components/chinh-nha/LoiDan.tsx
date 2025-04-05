import { View, Text, FlatList, ActivityIndicator, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import VideoSection from '../common/VideoSection'
import { getBaiVietByThuThuat, getBaiVietCategoryById, getChinhNhaThuThuatByChinhNhaId, getVideoCategoryById, getVideosByThuThuat } from '@/lib/apiCall';
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
    const [videos, setVideos] = useState<Array<any>>([]); // State để lưu video.data
    const [baiViets, setBaiViets] = useState<Array<any>>([]); // State để lưu bài viết

    useEffect(() => {
        fetchBaiVietLoiDan();
        fetchVideoLoiDan();
    }, [chinh_nha_id]);
    const fetchBaiVietLoiDan = async () => {
        try {
            if (chinh_nha_id) {
                const res = await getChinhNhaThuThuatByChinhNhaId(chinh_nha_id);
                if (res && res.data) {
                    const baiVietPromises = res.data.map((item: any) => getBaiVietByThuThuat(item.thu_thuat_id.id));
                    const baiVietsData = await Promise.all(baiVietPromises);

                    // Định dạng lại dữ liệu để mỗi item nằm trong key `bai_viet_id`
                    const formattedBaiViets = baiVietsData
                        .map(baiViet => baiViet.data) // Lấy `baiViet.data` từ mỗi lời gọi
                        .flat() // Gộp tất cả các mảng con thành một mảng
                        .map((item: any) => ({ bai_viet_id: item })); // Đặt mỗi item vào key `bai_viet_id`

                    if (formattedBaiViets.length === 0) {
                        setHasBaiViet(false); // Nếu không có bài viết, đặt hasBaiViet thành false
                    } else {
                        setBaiViets(formattedBaiViets); // Lưu dữ liệu vào state
                    }
                } else {
                    setHasBaiViet(false); // Nếu không có dữ liệu từ API, đặt hasBaiViet thành false
                }
            } else {
                setHasBaiViet(false); // Nếu không có chinh_nha_id, đặt hasBaiViet thành false
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setHasBaiViet(false); // Nếu xảy ra lỗi, đặt hasBaiViet thành false
        }
    };
    const fetchVideoLoiDan = async () => {
        try {
            if (chinh_nha_id) {
                const res = await getChinhNhaThuThuatByChinhNhaId(chinh_nha_id);
                if (res && res.data) {
                    const videoPromises = res.data.map((item: any) => getVideosByThuThuat(item.thu_thuat_id.id));
                    const videosd = await Promise.all(videoPromises);

                    const formattedVideos = videosd
                        .map(video => video.data) // Lấy `video.data` từ mỗi lời gọi
                        .flat() // Gộp tất cả các mảng con thành một mảng
                        .map((item: any) => ({ video_id: item })); // Đặt mỗi item vào key `video_id`

                    if (formattedVideos.length === 0) {
                        setHasVideo(false); // Nếu không có video, đặt hasVideo thành false
                    } else {
                        setVideos(formattedVideos); // Lưu dữ liệu vào state
                    }
                } else {
                    setHasVideo(false); // Nếu không có dữ liệu từ API, đặt hasVideo thành false
                }
            } else {
                setHasVideo(false); // Nếu không có chinh_nha_id, đặt hasVideo thành false
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setHasVideo(false);
        }
    };

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
                                    videos && videos.length != 0
                                        ?
                                        <ScrollView
                                            horizontal
                                            className='mt-[10px]'
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            {
                                                videos.map((item: any, index: number) => (
                                                    <VideoSection flag={flag} setFlag={setFlag} key={index} customImageStyle={`${videos.length === 1 ? "w-96 h-56" : ''}`} item={item.video_id} isLast={index === videos.length - 1} />
                                                )
                                                )
                                            }
                                        </ScrollView>
                                        :
                                        <View className={`${videos.length === 1 ? "h-[234px]" : 'h-[202px]'} justify-center`}>
                                            <ActivityIndicator color={'#00E5E5'} />
                                        </View>
                                }
                            </View>
                        )}
                        {hasBaiViet && (
                            <View className='mt-[17px] md:mt-[20px]'>
                                <Text className='text-[#626262] text-[14px] font-psemibold'>Lời dặn bằng bài viết</Text>
                                {
                                    baiViets && baiViets.length != 0
                                        ?
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            className='mt-[10px]'
                                        >
                                            {
                                                baiViets.map((item: any, index: number) => (
                                                    <BaiVietSection flag={flag} setFlag={setFlag} key={index} customImageStyle={`${baiViets.length === 1 ? "w-96 h-56" : ''}`} item={item.bai_viet_id} isLast={index === baiViets.length - 1} />
                                                ))
                                            }
                                        </ScrollView>
                                        :
                                        <View className={`${baiViets.length === 1 ? "h-[234px]" : 'h-[160px]'} justify-center`}>
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

