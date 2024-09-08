import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ImageBackground, Image } from 'expo-image'
import { icons, images } from '@/constants'
import { SERVER_URL } from '@/utils/uri'
import useUser from '@/hooks/auth/useUser'
import CustomButton from '@/components/common/CustomButton'
import { calculateDaysDifference, formatDate } from '@/lib/commonFunctions'
import { router } from 'expo-router'
import { getAvatar } from '@/lib/apiCall'

export default function LovingScreen() {
    const { user } = useUser();
    const [avatar, setAvatar] = useState<Avatar>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            const id = user.avatar_id;
            fetchAvatar(id);
        }
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
    const onPress = () => {
        router.dismissAll();
        router.replace("/(tabs)");
    }
    return (
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
                <View className='w-[40%] items-center'>
                    {
                        !loading
                            ?
                            avatar
                                ?
                                <View className='w-[130px] h-[130px] bg-white rounded-full items-center justify-center'>
                                    <Image source={{ uri: `${SERVER_URL}${avatar.value}` }} contentFit='contain' alt="avatar" transition={.5} className='rounded-full w-full h-full' />
                                </View>
                                :
                                <View className='w-[130px] h-[130px] bg-white rounded-full items-center justify-center'>
                                </View>
                            :
                            <View className="h-[130px] w-[130px] bg-white rounded-full justify-center items-center">
                                <ActivityIndicator color={'#00E5E5'} />
                            </View>
                    }
                    <Text className='text-white text-[16px] font-mbold'>{user?.ho_va_ten}</Text>
                </View>
                <View className='w-[20%] items-center justify-center h-[100px]'>
                    <Image source={images.heartFly} className='absolute w-[100px] h-[100px] top-[-50px]' />
                    <Image source={icons.heart} className='w-[36px] h-[33px]' />
                </View>
                <View className='w-[40%] items-center'>
                    <View className='w-[130px] h-[130px] bg-white rounded-full items-center justify-center'>
                        <Image source={icons.macCaiDamon} contentFit='contain' className='rounded-full w-[126px] h-[126px]' />
                    </View>
                    <Text className='text-white text-[16px] font-mbold'>Mắc cài Damon</Text>
                </View>
            </View>
            <View className='h-[25%] items-start flex-row justify-center'>
                <CustomButton
                    title="Quay lại"
                    handlePress={onPress}
                    containerStyles="w-[140px]"
                    buttonStyle="rounded-full min-h-[50px] bg-[#EDEDED] border-[#D7D7D7] border-[1px]"
                    textStyles=" font-pextrabold text-[16px] text-[#747474]"
                    iconStyle="w-[25px] h-[16px] mr-[12px]" flag={false} icon={undefined} isLoading={undefined} colorFrom={undefined} colorTo={undefined} iconRight={undefined} />
                <View className='w-[10px]'></View>
                <CustomButton
                    title="Chia sẻ ngay"
                    handlePress={() => { }}
                    containerStyles="w-[140px]"
                    buttonStyle="rounded-full min-h-[50px] bg-[#FFFFFF] border-[#1762A0] border-[1px]"
                    textStyles="text-[#17639F] font-pextrabold text-[16px]"
                    iconStyle="w-[25px] h-[16px] ml-[12px]" flag={false} icon={undefined} isLoading={undefined} colorFrom={undefined} colorTo={undefined} iconRight={undefined} />
            </View>
        </ImageBackground>
    )
}