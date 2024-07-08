import { View, Text, FlatList, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import { SERVER_URL } from '@/utils/uri';
import images from '@/constants/images';
import ImageViewer from 'react-native-image-zoom-viewer';
import { icons } from '@/constants';
export default function QuaTrinhImage({ anh_1, anh_2, anh_3, anh_4, anh_5, anh_6, anh_7, anh_8 }: any) {
    const gallery = [
        {
            url: `${SERVER_URL}${anh_1}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_2}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_3}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_4}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_5}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_6}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_7}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_8}`,
            props: {
            }
        },
    ]
    return (
        <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9]'>
            <Text className='text-[16px] font-pbold text-[#5EBA1B] mb-[4px]'>2. Hình ảnh quá trình</Text>
            {
                anh_1 && anh_2 && anh_3 && anh_4 && anh_5 && anh_6 && anh_7 && anh_8
                    ?
                    <FlatList
                        data={[
                            { key: 'anh_1' },
                            { key: 'anh_2' },
                            { key: 'anh_3' },
                            { key: 'anh_4' },
                            { key: 'anh_5' },
                            { key: 'anh_6' },
                            { key: 'anh_7' },
                            { key: 'anh_8' },
                        ]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            switch (item.key) {
                                case 'anh_1':
                                    return <ImageItem video_thumbnail={anh_1} gallery={gallery} index={index} />;
                                case 'anh_2':
                                    return <ImageItem video_thumbnail={anh_2} gallery={gallery} index={index} />;
                                case 'anh_3':
                                    return <ImageItem video_thumbnail={anh_3} gallery={gallery} index={index} />;
                                case 'anh_4':
                                    return <ImageItem video_thumbnail={anh_4} gallery={gallery} index={index} />;
                                case 'anh_5':
                                    return <ImageItem video_thumbnail={anh_5} gallery={gallery} index={index} />;
                                case 'anh_6':
                                    return <ImageItem video_thumbnail={anh_6} gallery={gallery} index={index} />;
                                case 'anh_7':
                                    return <ImageItem video_thumbnail={anh_7} gallery={gallery} index={index} />;
                                case 'anh_8':
                                    return <ImageItem video_thumbnail={anh_8} gallery={gallery} index={index} />;
                                default:
                                    return null;
                            }
                        }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                    :
                    <View className={`flex justify-center items-center`}>
                        <Text className={`text-[14px] ml-5`}>Không có dữ liệu</Text>
                    </View>
            }

        </View>
    )
}

const ImageItem = ({ video_thumbnail, gallery, index }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View className={`flex-1 justify-center items-start my-2`}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
                <Image
                    source={video_thumbnail ? { uri: `${SERVER_URL}${video_thumbnail}` } : images.bannerDefault}
                    className={`h-[180px] w-[180px] overflow-hidden rounded-[20px] bg-[#F1F1F1] ${index === 7 ? '' : 'mr-2'}`}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    className='bg-white w-full h-full'
                >
                    <ImageViewer enablePreload={true} flipThreshold={200} pageAnimateTime={200} enableSwipeDown={true} swipeDownThreshold={100} onCancel={() => setModalVisible(false)} imageUrls={gallery} index={index} />
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className='absolute bottom-10 left-5 bg-white rounded-full'
                    >
                        <View className='flex-row justify-center items-center gap-2 px-10 py-5'>
                            <Image source={icons.backArrow} resizeMode='contain' className='w-[25px] h-[16px]' />
                            <Text className='font-pextrabold text-[16px] text-[#747474]'>Quay lại</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>

    );
};