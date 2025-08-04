import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform, StyleSheet, Share } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { icons } from '@/constants';
import Toast from 'react-native-toast-message'
import axios from 'axios';
import { formatInformation, getToday } from '@/lib/commonFunctions';
import useUser from '@/hooks/auth/useUser';
import { createCustomerLibrary, updateCustomerLibrary } from '@/lib/apiCall';
import { SERVER_URI } from '@/utils/uri';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface PictureViewProps {
    picture: string;
    status: string;
    id: number | null
    setPicture: React.Dispatch<React.SetStateAction<string>>
}
export default function PreviewScreen({ picture, setPicture, status, id }: PictureViewProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { user } = useUser();
    
    const handleBack = () => {
        setPicture("");
    };
    
    const handleSave = async () => {
        try {
            // Tạo tên file duy nhất
            const fileName = `mybraces_${Date.now()}.jpg`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            
            // Copy ảnh từ camera temp sang Documents
            await FileSystem.copyAsync({
                from: picture,
                to: fileUri
            });
            
            // Chia sẻ ảnh để người dùng có thể lưu vào thư viện
            await Share.share({
                url: fileUri,
                message: 'Ảnh từ ứng dụng My Braces'
            });
            
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Ảnh đã được lưu và có thể chia sẻ'
            });
        } catch (error) {
            console.error('Error saving image:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể lưu ảnh'
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
        <View className='w-full h-full bg-black'>
            <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                className='absolute top-0 left-0 right-0 h-32 z-10'
            />
            <View className='h-28 w-full justify-end z-20'>
                <TouchableOpacity 
                    className='p-[10px] ml-4 w-10 h-10 items-center justify-center'
                    onPress={handleBack}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Image 
                source={picture} 
                className='w-full flex-1' 
                style={[{ transform: [{ scaleX: -1 }] }]} 
                contentFit="cover"
            />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                className='absolute bottom-0 left-0 right-0 h-40 z-10'
            />
            <BlurView intensity={20} className='absolute bottom-0 left-0 right-0 h-40 z-20'>
                <View className='h-full w-full flex justify-center items-center'>
                    {
                        !loading
                            ?
                            <View className='flex flex-row w-full px-4'>
                                <TouchableOpacity 
                                    onPress={handleUpload} 
                                    className='flex-1 h-full items-center justify-center'
                                >
                                    <View className='bg-white/10 p-4 rounded-full'>
                                        <Image source={icons.upload} className='w-[30px] h-[30px]' />
                                    </View>
                                    <Text className='text-white mt-2 font-semibold'>Sử dụng ảnh</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handleSave} 
                                    className='flex-1 h-full items-center justify-center'
                                >
                                    <View className='bg-white/10 p-4 rounded-full'>
                                        <Image source={icons.download2} className='w-[30px] h-[30px]' />
                                    </View>
                                    <Text className='text-white mt-2 font-semibold'>Chia sẻ ảnh</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handleBack} 
                                    className='flex-1 h-full items-center justify-center'
                                >
                                    <View className='bg-white/10 p-4 rounded-full'>
                                        <Image source={icons.trashWhite} className='w-[30px] h-[30px]' />
                                    </View>
                                    <Text className='text-white mt-2 font-semibold'>Xóa ảnh</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View className='justify-center items-center'>
                                <ActivityIndicator size="large" color="#00E5E5" />
                                <Text className='text-white mt-4 font-semibold'>Đang xử lý...</Text>
                            </View>
                    }
                </View>
            </BlurView>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});
