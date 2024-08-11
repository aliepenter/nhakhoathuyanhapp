import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { icons } from '@/constants';
import Toast from 'react-native-toast-message'
import axios from 'axios';
import { ADMIN_URI, SERVER_URI } from '@/utils/uri';
interface PictureViewProps {
    picture: string;
    setPicture: React.Dispatch<React.SetStateAction<string>>
}
export default function PreviewScreen({ picture, setPicture }: PictureViewProps) {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const handleBack = () => {
        setPicture("");
    };
    const showToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Thành công',
            text2: 'Ảnh đã được lưu vào thư viện của bạn'
        });
    }
    const handleSave = async () => {
        if (permissionResponse && permissionResponse.status !== 'granted') {
            await requestPermission().then(async res => {
                if (res.granted) {
                    await MediaLibrary.saveToLibraryAsync(picture);
                    showToast();
                }
            });
        } else {
            await MediaLibrary.saveToLibraryAsync(picture);
            showToast();
        }
    };
    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: picture,
                type: 'image/jpeg',
                name: 'test.jpg'
            } as any);
            await axios.post(`${ADMIN_URI}/api/customer`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        } catch (error) {
            console.error('Error uploading file:', error);
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
            </View>
        </View>
    )
}
