import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator, Modal, Platform } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import CustomHeader from '@/components/common/CustomHeader';
import { SERVER_URL } from '@/utils/uri';
import { icons } from '@/constants';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import ImageViewer from 'react-native-image-zoom-viewer';

export default function QuaTrinhDetailScreen() {
    const route = useRoute();
    const {
        anh_1,
        anh_2,
        anh_3,
        anh_4,
        anh_5,
        anh_6,
        anh_7,
        anh_8,
        anh_9,
        anh_10,
        anh_11,
        headerTitle,
        title
    }: any = route.params;
    const imageUrls = [anh_1, anh_9, anh_10, anh_2, anh_3, anh_4, anh_5, anh_6, anh_7, anh_11, anh_8];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const url = `${SERVER_URL}${imageUrls[currentImageIndex]}`;
    const [modalVisible, setModalVisible] = useState(false);

    const [imageHeight, setImageHeight] = useState(0);
    const [loading, setLoading] = useState(true);

    const onImageLoad = (event: any) => {
        const { height, width } = event.nativeEvent.source;
        const ratio = (screenWidth - 40) / width
        setImageHeight((height * ratio));
        setTimeout(() => {
            setLoading(false);
        }, 200);
    };

    const changeImage = (index: number) => {
        setLoading(true);
        setCurrentImageIndex(index);
    };
    const gallery = [
        {
            url: `${SERVER_URL}${anh_1}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_9}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_10}`,
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
            url: `${SERVER_URL}${anh_11}`,
            props: {
            }
        },
        {
            url: `${SERVER_URL}${anh_8}`,
            props: {
            }
        }
    ]
    return (
        <View className='bg-white h-full'>
            <CustomHeader title={headerTitle} customStyle="bg-transparent" />
            <View className='mt-[20px] px-[20px]'>
                <Text className='font-pbold text-[16px] text-center text-[#525252]'>{title}</Text>

                <TouchableOpacity className={`${!loading ? '' : 'hidden'}`} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
                    <Image
                        source={{ uri: url }}
                        style={[{ height: imageHeight }]}
                        className={`rounded-[10px] h-[187px] mt-10 bg-[#F1F1F1]`}
                        resizeMode='contain'
                        onLoad={onImageLoad}

                    />
                </TouchableOpacity>
                <View className={`${!loading ? 'hidden' : ''} h-96 justify-center`}>
                    <ActivityIndicator />
                </View>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View
                        className='bg-white w-full h-full'
                    >
                        <ImageViewer enablePreload={true} flipThreshold={200} pageAnimateTime={200} enableSwipeDown={true} swipeDownThreshold={100} onCancel={() => setModalVisible(false)} imageUrls={gallery} index={currentImageIndex} />
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className='absolute bottom-10 left-5 bg-white rounded-full'
                        >
                            <View className='flex-row justify-center items-center gap-2 px-5 py-2'>
                                <Image source={icons.backArrow} resizeMode='contain' className='w-[20px] h-[11px]' />
                                <Text className=' text-[14px] text-[#747474]'>Quay lại</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>

            </View>
            <View className={`${Platform.OS === 'ios' ? 'mt-[20px]' : 'mt-[10px]'} flex-wrap flex-row justify-center absolute bottom-5 px-[20px]`}>
                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(0)}>
                    <Image
                        source={icons.truoc}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(1)}>
                    <Image
                        source={icons.truocHa}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(2)}>
                    <Image
                        source={icons.truocDuoiLen}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(3)}>
                    <Image
                        source={icons.trai}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(4)}>
                    <Image
                        source={icons.phai}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(5)}>
                    <Image
                        source={icons.matTren}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(6)}>
                    <Image
                        source={icons.matDuoi}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(7)}>
                    <Image
                        source={icons.truocKhongCuoi}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(8)}>
                    <Image
                        source={icons.truocCuoi}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(9)}>
                    <Image
                        source={icons.cheoCuoi}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity className="w-[14.2857142457%] mt-2 flex-row justify-center" onPress={() => changeImage(10)}>
                    <Image
                        source={icons.nghieng}
                        className="w-[36px] h-[36px]"
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}