import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SERVER_URL } from '@/utils/uri';
import images from '@/constants/images';
import ImageViewer from 'react-native-image-zoom-viewer';
import { icons } from '@/constants';
import { formatDate } from '@/lib/commonFunctions';
import { Image } from 'expo-image';
export default function QuaTrinhImage({ anh }: any) {
    const gallery = [
        {
            url: `${SERVER_URL}${anh?.anh_7}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_6}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_11}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_8}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_13}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_12}`,
            props: {
            }
        },

        {
            url: `${SERVER_URL}${anh?.anh_1}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_9}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_10}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_2}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_3}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_4}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh?.anh_5}`,
            props: {
            }
        },

    ]
    return (
        <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9] md:pb-[20px]'>
            <Text className='text-[16px] md:text-[22px] font-pbold text-[#5EBA1B] mb-[4px] md:mb-[13px]'>2. Ảnh quá trình{anh?.ngay_chup ? " (Chụp ngày " + formatDate(anh?.ngay_chup, "minimize") + ")" : ""}</Text>
            {
                anh
                    ?
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <ImageItem video_thumbnail={anh.anh_7} gallery={gallery} index={0} />
                        <ImageItem video_thumbnail={anh.anh_6} gallery={gallery} index={1} />
                        <ImageItem video_thumbnail={anh.anh_11} gallery={gallery} index={2} />
                        <ImageItem video_thumbnail={anh.anh_8} gallery={gallery} index={3} />
                        <ImageItem video_thumbnail={anh.anh_13} gallery={gallery} index={4} />
                        <ImageItem video_thumbnail={anh.anh_12} gallery={gallery} index={5} />
                        <ImageItem video_thumbnail={anh.anh_1} gallery={gallery} index={6} />
                        <ImageItem video_thumbnail={anh.anh_9} gallery={gallery} index={7} />
                        <ImageItem video_thumbnail={anh.anh_10} gallery={gallery} index={8} />
                        <ImageItem video_thumbnail={anh.anh_2} gallery={gallery} index={9} />
                        <ImageItem video_thumbnail={anh.anh_3} gallery={gallery} index={10} />
                        <ImageItem video_thumbnail={anh.anh_4} gallery={gallery} index={11} />
                        <ImageItem video_thumbnail={anh.anh_5} gallery={gallery} index={12} />
                    </ScrollView>
                    :
                    <View className={`flex justify-center items-center`}>
                        <Text className={`text-[14px] md:text-[20px] ml-5`}>Không có dữ liệu</Text>
                    </View>
            }

        </View>
    )
}

const ImageItem = ({ video_thumbnail, gallery, index }: any) => {
    const [modalVisible, setModalVisible] = useState(false);

    // Tính toán kích thước dựa trên tỷ lệ 16:9
    const isWideImage = index >= 5 && index <= 12;
    const width = isWideImage ? 320 : 180; // Width cho ảnh 16:9 hoặc mặc định
    const height = isWideImage ? (width * 9) / 16 : 180; // Height dựa trên tỷ lệ 16:9 hoặc mặc định

    return (
        <View className={`flex-1 justify-center items-start my-2`}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setModalVisible(true)}
                className={`rounded-[20px] ${index === 12 ? '' : 'mr-2'}`}
                style={{ width, height }} // Áp dụng width và height động
            >
                <Image
                    source={video_thumbnail ? { uri: `${SERVER_URL}${video_thumbnail}` } : images.bannerDefault}
                    className={`h-full w-full bg-gray-100 overflow-hidden rounded-[20px]`}
                    contentFit="contain"
                    transition={500}
                />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className='bg-white w-full h-full'>
                    <ImageViewer
                        enablePreload={true}
                        flipThreshold={200}
                        pageAnimateTime={200}
                        enableSwipeDown={true}
                        swipeDownThreshold={100}
                        onCancel={() => setModalVisible(false)}
                        imageUrls={gallery}
                        index={index}
                    />
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className='absolute bottom-10 left-5 bg-white rounded-full'
                    >
                        <View className='flex-row justify-center items-center gap-2 px-5 py-2'>
                            <Image
                                transition={500}
                                source={icons.backArrow}
                                contentFit='contain'
                                className='w-[20px] h-[11px]'
                            />
                            <Text className=' text-[14px] text-[#747474]'>Quay lại</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};