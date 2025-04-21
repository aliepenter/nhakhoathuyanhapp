import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { CameraView, CameraRatio } from 'expo-camera';
import { Image } from 'expo-image';
import { icons, images } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import PreviewScreen from './preview.screen';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

type CameraScreenProps = {};

export default function CameraScreen(props: CameraScreenProps) {
    const cameraRef = React.useRef<CameraView>(null);
    const [picture, setPicture] = React.useState<string>("");
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const { statusImage, id }: any = useLocalSearchParams();
    const [ratio, setRatio] = useState<CameraRatio>('4:3');
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;

    const router = useRouter();
    const handleBack = () => {
        router.back();
    };

    const handleGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });
        if (!result.canceled) {
            setPicture(result.assets[0].uri);
        }
    }

    const takePicture = async () => {
        const res = await cameraRef.current?.takePictureAsync({
            quality: 1,
        });
        setPicture(res!.uri)
    }

    if (picture) {
        return <PreviewScreen picture={picture} setPicture={setPicture} status={statusImage} id={id} />
    }

    return (
        <View className='flex-1 justify-center bg-black'>
            {/* Header */}
            <View className='flex-row bg-black/80 items-center justify-center h-28 w-full absolute top-0 z-10'>
                <View className='w-[15%] h-[60%] items-center justify-end'>
                    <TouchableOpacity 
                        className='p-[10px] bg-white/10 rounded-full' 
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View className='w-[70%] items-center'>
                    <Text className='text-white text-lg font-semibold'>Chụp ảnh</Text>
                </View>
                <View className='w-[15%] h-[60%] items-center justify-end'></View>
            </View>

            {/* Camera with overlay */}
            <View className='flex-1 relative'>
                <CameraView
                    mute={true}
                    zoom={0}
                    ref={cameraRef}
                    mode="picture"
                    facing={facing}
                    style={{
                        width: screenWidth,
                        height: screenHeight,
                        maxHeight: screenHeight,
                    }}
                    ratio={ratio}
                >
                </CameraView>
            </View>

            {/* Bottom controls */}
            <View className='absolute bottom-0 flex-row bg-black/80 items-center h-40 w-full justify-center'>
                <View className='w-[15%] flex justify-center items-center pl-3'>
                    <TouchableOpacity 
                        className='w-[60px] h-[60px] rounded-full flex items-center justify-center bg-white/10' 
                        onPress={handleGallery}
                    >
                        <Image source={icons.galleryWhite} className='w-[50%] h-[50%]' contentFit='contain' />
                    </TouchableOpacity>
                </View>
                <View className='w-[70%] flex justify-center items-center'>
                    <TouchableOpacity 
                        className='w-[70px] h-[70px]' 
                        onPress={takePicture}
                    >
                        <View className='bg-white w-full h-full flex items-center justify-center rounded-full shadow-lg shadow-white/20'>
                            <View className='bg-black w-[90%] h-[90%] rounded-full flex items-center justify-center'>
                                <View className='bg-white w-[90%] h-[90%] rounded-full'></View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className='w-[15%]'></View>
            </View>
        </View>
    );
}
