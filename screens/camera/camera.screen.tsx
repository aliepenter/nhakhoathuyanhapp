import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useRef, useState } from 'react';
import { CameraView } from 'expo-camera';
import { Image } from 'expo-image';
import { icons, images } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import PreviewScreen from './preview.screen';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';

type CameraScreenProps = {};

export default function CameraScreen(props: CameraScreenProps) {
    const cameraRef = React.useRef<CameraView>(null);
    const [picture, setPicture] = React.useState<string>("");
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const route = useRoute();
    const { statusImage, id }: any = route.params;

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
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
        <View className='flex-1 justify-center'>
            {/* Header */}
            <View className='flex-row bg-black items-center justify-center h-28 w-full'>
                <View className='w-[15%] h-[60%] items-center justify-end'>
                    <TouchableOpacity className='p-[10px]' onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View className='w-[70%]'></View>
                <View className='w-[15%] h-[60%] items-center justify-end'></View>
            </View>

            {/* Camera with overlay */}
            <View className='relative flex-1'>
                <CameraView
                    mute={true}
                    zoom={0}
                    ref={cameraRef}
                    mode="picture"
                    className='flex-1'
                    facing={facing}
                >
                    {/* Khung người */}
                    {/* <Image
                        source={images.body} // Thay bằng đường dẫn ảnh khung người của bạn
                        className='absolute top-0 left-16 right-0 bottom-28 w-[70%]'
                        contentFit='contain' 
                    /> */}
                </CameraView>
            </View>

            {/* Bottom controls */}
            <View className='bottom-0 flex-row bg-black items-center h-40 w-full justify-center'>
                <View className='w-[15%] flex justify-center items-center'>
                    <TouchableOpacity className='w-[60px] h-[60px] rounded-full flex items-center justify-center' onPress={handleGallery}>
                        <Image source={icons.galleryWhite} className='w-[50%] h-[50%]' contentFit='contain' />
                    </TouchableOpacity>
                </View>
                <View className='w-[70%] flex justify-center items-center'>
                    <TouchableOpacity className='w-[70px] h-[70px]' onPress={takePicture}>
                        <View className='bg-white w-full h-full flex items-center justify-center rounded-full'>
                            <View className='bg-black w-[90%] h-[90%] rounded-full flex items-center justify-center'>
                                <View className='bg-white w-[90%] h-[90%] rounded-full'></View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className='w-[15%]'>
                    {/* <TouchableOpacity className='w-[40px] h-[40px] bg-gray-200 rounded-full flex items-center justify-center' onPress={toggleCameraFacing}>
                        <Image source={icons.flip} className='w-[50%] h-[50%]' contentFit='cover' />
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    );
}
