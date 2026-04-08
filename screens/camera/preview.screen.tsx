import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform, StyleSheet, Share } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { icons } from '@/constants';
import Toast from 'react-native-toast-message'
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

const RETRYABLE_UPLOAD_ERROR_PATTERNS = [
    'eai_again',
    'getaddrinfo',
    'timeout',
    'network request failed',
    'internal server error',
    's3 upload failed',
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableUploadError = (statusCode?: number, message?: string) => {
    if (typeof statusCode === 'number' && statusCode >= 500) {
        return true;
    }

    const normalized = (message || '').toLowerCase();
    return RETRYABLE_UPLOAD_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
};

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
        let uploadUri = picture;
        try {
            // Normalize EXIF orientation before upload (fixes iOS 90° rotation bug)
            if (Platform.OS === 'ios') {
                const manipulated = await ImageManipulator.manipulateAsync(
                    picture,
                    [],
                    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
                );
                uploadUri = manipulated.uri;
            }

            const fileInfo = await FileSystem.getInfoAsync(uploadUri);
            if (!fileInfo.exists) {
                throw new Error('Local image file not found before upload');
            }

            const formData = new FormData();
            formData.append('file', {
                uri: uploadUri,
                type: 'image/jpeg',
                name: fileName
            } as any);

            const maxRetries = 3;
            let responseData: any = null;
            let lastUploadError: any = null;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const response = await fetch(`${SERVER_URI}/file/upload-selfie`, {
                        method: 'POST',
                        body: formData,
                    });

                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('application/json')) {
                        responseData = await response.json();
                    } else {
                        responseData = await response.text();
                    }

                    if (!response.ok) {
                        throw {
                            status: response.status,
                            responseData,
                            message: 'Upload selfie failed',
                        };
                    }

                    lastUploadError = null;
                    break;
                } catch (error) {
                    const uploadError = error as any;
                    const statusCode = uploadError?.status || uploadError?.response?.status;
                    const responsePayload = uploadError?.responseData || uploadError?.response?.data;
                    const errorMessage =
                        responsePayload?.message ||
                        responsePayload?.error ||
                        uploadError?.message ||
                        '';

                    lastUploadError = {
                        ...uploadError,
                        status: statusCode,
                        responseData: responsePayload,
                        message: uploadError?.message || 'Upload selfie failed',
                    };

                    const canRetry = isRetryableUploadError(statusCode, errorMessage);
                    if (!canRetry || attempt === maxRetries) {
                        break;
                    }

                    await sleep(600 * attempt);
                }
            }

            if (lastUploadError) {
                throw lastUploadError;
            }

            const anh: any = {
                image_path: `img/uploads/selfie/${fileName}`,
                user_id: user?.id,
                system: Platform.OS === 'ios' ? 1 : 0
            };

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
            const uploadError = error as any;
            const statusCode = uploadError?.status || uploadError?.response?.status;
            const responseData = uploadError?.responseData || uploadError?.response?.data;
            const serverMessage =
                responseData?.message ||
                responseData?.error ||
                uploadError?.message;

            console.error('Error uploading file:', {
                message: uploadError?.message,
                status: statusCode,
                responseData,
                uploadUri,
            });

            Toast.show({
                type: 'error',
                text1: statusCode ? `Upload lỗi (${statusCode})` : 'Đã có lỗi xảy ra',
                text2: serverMessage || 'Xin thử lại sau',
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
