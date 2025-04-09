import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator, Modal, Platform } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '@/components/common/CustomHeader';
import { SERVER_URL } from '@/utils/uri';
import { icons } from '@/constants';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import ImageViewer from 'react-native-image-zoom-viewer';
import { useLocalSearchParams } from 'expo-router';
export default function QuaTrinhDetailScreen() {
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
        anh_12,
        anh_13,
        headerTitle,
        title
    }: any = useLocalSearchParams();
    const imageUrls = [anh_1, anh_9, anh_10, anh_2, anh_3, anh_4, anh_5, anh_7, anh_6, anh_11, anh_8, anh_12, anh_13];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentActiveIndex, setCurrenActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const [imageHeight, setImageHeight] = useState(187);
    const [imageWidth, setImageWidth] = useState(500);
    const [isIn, setIsIn] = useState(true);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false); // State để theo dõi lỗi ảnh
    const onImageLoad = (event: any) => {
        const { height, width } = event.nativeEvent.source;
        const ratio = (screenWidth - 40) / width
        const detaultRatio = width / height;
        let h = height * ratio;
        let w = width * ratio;

        if (screenWidth > 768) {
            if (width < height) {
                h = h / 2;
                w = h * detaultRatio;
            }
        }
        setImageHeight(h);
        setImageWidth(w);
        if (height >= width) {
            setIsIn(false);
        } else {
            setIsIn(true);
        }
        setTimeout(() => {
            setLoading(false);
        }, 200);
    };

    const changeImage = (index: number) => {
        if (index !== currentImageIndex) {
            setCurrenActiveIndex(index); // Cập nhật trạng thái active của icon
            setLoading(true); // Bật trạng thái loading
            setImageError(false); // Đặt lại trạng thái lỗi ảnh
            setTimeout(() => {
                setCurrentImageIndex(index); // Cập nhật trạng thái active của icon ngay lập tức
            }, 200);
            // Trì hoãn việc hiển thị ảnh để loading hiển thị trước
            if (!imageUrls[index]) {
                setImageError(true);
                setLoading(false);
            }// Thời gian trễ (300ms)
        }
    };
    const iconList = [
        icons.truoc, icons.truocHa, icons.truocDuoiLen,
        icons.trai, icons.phai, icons.matTren,
        icons.matDuoi, icons.truocKhongCuoi, icons.truocCuoi,
        icons.cheoCuoi, icons.nghieng, icons.panorama, icons.cephalo
    ];

    const activeIconList = [
        icons.truocActive, icons.truocHaActive, icons.truocDuoiLenActive,
        icons.traiActive, icons.phaiActive, icons.matTrenActive,
        icons.matDuoiActive, icons.truocKhongCuoiActive, icons.truocCuoiActive,
        icons.cheoCuoiActive, icons.nghiengActive, icons.panoramaActive, icons.cephaloActive
    ];
    return (
        <View className='bg-white h-full'>
            <CustomHeader title={headerTitle} customStyle="bg-transparent" />
            <View className='mt-[20px] px-[20px]'>
                <Text className='font-pbold text-[16px] text-center text-[#525252]'>{title}</Text>
                <TouchableOpacity
                    className={`${Platform.OS === 'ios' ? !loading && !imageError ? '' : 'opacity-0' : !loading && !imageError ? '' : 'hidden'} md:items-center`}
                    activeOpacity={0.9}
                    onPress={() => setModalVisible(true)}
                >
                    {
                        <Image
                            source={{ uri: `${SERVER_URL}${imageUrls[currentImageIndex]}` }}
                            style={{ height: imageHeight, width: imageWidth }}
                            className={`rounded-[10px] bg-[#F1F1F1] ${isIn ? 'mt-36' : 'mt-24'}`}
                            resizeMode='contain'
                            onLoad={onImageLoad}
                            onError={() => {
                                setImageError(true);
                                setLoading(false);
                            }}
                        />
                    }
                </TouchableOpacity>
                {
                    imageError && (
                        <View className='absolute left-[40%] h-96 justify-center items-center'>
                            <Text className='font-bold'>Không thể tải ảnh</Text>
                        </View>
                    )

                }
                <View className={`${!loading ? 'hidden' : ''} absolute left-[52%] h-[500px] justify-center`}>
                    <ActivityIndicator color={'#00E5E5'} />
                </View>

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
                            imageUrls={imageUrls.map(url => ({ url: `${SERVER_URL}${url}` }))}
                            index={currentImageIndex}
                        />
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

            <View className={`${Platform.OS === 'ios' ? 'mt-[20px]' : 'mt-[10px]'} flex-wrap flex-row justify-center absolute bottom-16 px-[20px]`}>
                {iconList.map((icon, index) => (
                    <TouchableOpacity
                        key={index}
                        className="w-[14.2857142457%] mt-2 flex-row justify-center"
                        onPress={() => changeImage(index)}
                    >
                        <Image
                            source={index === currentActiveIndex ? activeIconList[index] : icon}
                            className="w-[36px] h-[36px]"
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}