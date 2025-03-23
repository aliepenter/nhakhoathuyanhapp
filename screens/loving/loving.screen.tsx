import { View, Text, ActivityIndicator, Share, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, Image } from 'expo-image'
import { icons, images } from '@/constants'
import { SERVER_URL } from '@/utils/uri'
import useUser from '@/hooks/auth/useUser'
import CustomButton from '@/components/common/CustomButton'
import { calculateDaysDifference, formatDate } from '@/lib/commonFunctions'
import { router } from 'expo-router'
import { getAvatar, getLoving } from '@/lib/apiCall'
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function LovingScreen() {
    const { user } = useUser();
    const [avatar, setAvatar] = useState<Avatar>();
    const [loving, setLoving] = useState<Loving>();
    const [loading, setLoading] = useState(true);
    const viewShotRef = useRef<ViewShot>(null);

    const takeScreenshot = async () => {
        try {
            if (viewShotRef.current && viewShotRef.current.capture) {
                const uri = await viewShotRef.current.capture();
                if (uri) {
                    await Sharing.shareAsync(uri, {
                        mimeType: "image/jpeg",
                        dialogTitle: "Chia sẻ khoảnh khắc này",
                        UTI: "share.jpeg"
                    });
                }
            } else {
                console.warn('ViewShot ref is not set');
            }
        } catch (error) {
            console.error('Failed to take screenshot', error);
        }
    };

    useEffect(() => {
        if (user) {
            const id = user.avatar_id;
            fetchAvatar(id);
        }
        fetchLoving(1);
    }, [user]);


    const fetchAvatar = async (userId: number) => {
        try {
            const res = await getAvatar(userId);
            if (res) {
                setAvatar(res.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLoving = async (id: number) => {
        try {
            const res = await getLoving(id);
            if (res) {
                setLoving(res.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    const onPress = () => {
        router.dismissAll();
        router.replace("/(tabs)");
    }
    return (
        <View className='w-full h-full'>
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
                <ImageBackground source={images.bgLovingPage} className='w-full h-full' contentFit="fill">
                    <View className='justify-end items-center h-[50%]'>
                        <ImageBackground source={icons.heartBg} className='w-[355px] h-[295px] justify-center items-center' contentFit="contain">
                            <Text className='text-[24px] leading-[30px] font-mmedium'>Đồng hành cùng nhau</Text>
                            <Text className='text-[55px] leading-[70px] font-mbold text-[#FB3F4A]'>
                                {
                                    user && user.ngay_gan_mc != null ? calculateDaysDifference(user.ngay_gan_mc) : 0
                                } ngày
                            </Text>
                            <Text className='text-[30px] leading-[50px] font-mregular'>
                                {
                                    user && user.ngay_gan_mc != null ? formatDate(user.ngay_gan_mc, 'minimize') : 0
                                }
                            </Text>
                        </ImageBackground>
                    </View>
                    <View className='items-center h-[25%] flex-row'>
                        <View className='w-[45%] items-center'>
                            <View className='w-[130px] h-[130px] bg-white rounded-full items-center justify-center overflow-hidden'>
                                {!loading ?
                                    avatar ?
                                        <Image
                                            source={{ uri: `${SERVER_URL}${avatar.value}` }}
                                            contentFit='cover'
                                            transition={0.5}
                                            className='w-full h-full'
                                        />
                                        : <View className='w-full h-full bg-gray-300' /> // Placeholder while loading
                                    : <ActivityIndicator color={'#00E5E5'} />
                                }
                            </View>

                            <Text className='text-white text-[16px] font-mbold'>{user?.ho_va_ten}</Text>
                        </View>
                        <View className='w-[10%] items-center justify-center h-[100px]'>
                            <Image source={images.heartFly} className='absolute w-[100px] h-[100px] top-[-50px]' />
                            <Image source={icons.heart} className='w-[36px] h-[33px]' />
                        </View>
                        <View className='w-[45%] items-center'>
                            <View className='w-[130px] h-[130px] bg-white rounded-full items-center justify-center'>
                                <Image source={{ uri: `${SERVER_URL}${loving?.image}` }}
                                    contentFit='contain' transition={.5} className='rounded-full w-[126px] h-[126px]' />
                            </View>
                            <Text className='text-white text-[16px] font-mbold'>{loving?.name}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </ViewShot >
            <View className='h-[25%] items-start flex-row absolute top-[75%] w-full justify-center'>
                <CustomButton
                    title="Quay lại"
                    handlePress={onPress}
                    containerStyles="w-[140px]"
                    buttonStyle="rounded-full min-h-[50px] bg-[#EDEDED] border-[#D7D7D7] border-[1px]"
                    textStyles=" font-pextrabold text-[16px] text-[#747474]"
                    iconStyle="w-[25px] h-[16px] mr-[12px]" flag={false} icon={undefined} isLoading={undefined} colorFrom={undefined} colorTo={undefined} iconRight={undefined} notification={false} />
                <View className='w-[10px]'></View>
                <CustomButton
                    title="Chia sẻ ngay"
                    handlePress={takeScreenshot}
                    containerStyles="w-[140px]"
                    buttonStyle="rounded-full min-h-[50px] bg-[#FFFFFF] border-[#1762A0] border-[1px]"
                    textStyles="text-[#17639F] font-pextrabold text-[16px]"
                    iconStyle="w-[25px] h-[16px] ml-[12px]" flag={false} icon={undefined} isLoading={undefined} colorFrom={undefined} colorTo={undefined} iconRight={undefined} notification={false} />
            </View>
        </View>
    )
}