import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { icons } from '@/constants';
import Toast from 'react-native-toast-message'
import axios from 'axios';
import { formatInformation, getToday } from '@/lib/commonFunctions';
import useUser from '@/hooks/auth/useUser';
import { createCustomerLibrary, updateCustomerLibrary } from '@/lib/apiCall';
import { SERVER_URI } from '@/utils/uri';
interface PictureViewProps {
    picture: string;
    status: string;
    id: number | null
    setPicture: React.Dispatch<React.SetStateAction<string>>
}
export default function PreviewScreen({ picture, setPicture, status, id }: PictureViewProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { user } = useUser();
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const handleBack = () => {
        setPicture("");
    };
    const handleSave = async () => {
        if (permissionResponse && permissionResponse.status !== 'granted') {
            await requestPermission().then(async res => {
                if (res.granted) {
                    await MediaLibrary.saveToLibraryAsync(picture);
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công',
                        text2: 'Ảnh đã được lưu vào thư viện của bạn'
                    });
                }
            });
        } else {
            await MediaLibrary.saveToLibraryAsync(picture);
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Ảnh đã được lưu vào thư viện của bạn'
            });
        }
    };
    const handleUpload = async () => {
        setLoading(true);
        const fileName = `${getToday('path')}.jpg`;
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: picture,
                type: 'image/jpeg',
                name: fileName
            } as any);
            await axios.post(`${SERVER_URI}/file/upload-selfie`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        const anh: any = {
            image_path: `img/uploads/selfie/${fileName}`,
            user_id: user?.id,
            system: Platform.OS === 'ios' ? 1 : 0
        };
        try {
            if (status == 'true') {
                await updateCustomerLibrary(id, anh);
            } else {
                await createCustomerLibrary(anh);
            }
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Ảnh đã được tải lên'
            });
            setPicture("");
            router.dismissAll();
            router.replace({
                pathname: "/(tabs)/image-gallery",
                params: { refresh: Date.now() }
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Đã có lỗi xảy ra, xin thử lại sau',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className='w-full h-full'>
            <View className='bg-black h-28 w-full justify-end'>
                <TouchableOpacity className='p-[10px]' onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Image source={picture} className='w-full flex-1' />
            <View className='bg-black h-40 w-full flex flex-row justify-center items-center'>
                {
                    !loading
                        ?
                        <View className='flex flex-row'>
                            <TouchableOpacity onPress={handleUpload} className='w-[33.333333%] h-full items-center'>
                                <Image source={icons.upload} className='w-[30px] h-[30px]' />
                                <Text className='text-white mt-2'>Sử dụng ảnh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} className='w-[33.333333%] h-full items-center'>
                                <Image source={icons.download2} className='w-[30px] h-[30px]' />
                                <Text className='text-white mt-2'>Tải về máy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleBack} className='w-[33.333333%] h-full items-center'>
                                <Image source={icons.trashWhite} className='w-[30px] h-[30px]' />
                                <Text className='text-white mt-2'>Xóa ảnh</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View className={`justify-center`}>
                            <ActivityIndicator color={'#00E5E5'} />
                        </View>
                }

            </View>
        </View>
    )
}
