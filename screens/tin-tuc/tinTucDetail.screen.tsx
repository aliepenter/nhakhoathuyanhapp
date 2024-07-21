import { View, Text, ScrollView, Image, Dimensions, Linking, Alert } from 'react-native'
import React, { useCallback } from 'react'
import { SERVER_URL } from '@/utils/uri'
import CustomButton from '@/components/common/CustomButton';
import { formatDateTime } from '@/lib/commonFunctions';
const { width } = Dimensions.get('window');
export default function TinTucDetailScreen({ postThumb, postTime, postTitle, postContent, postUrl }: any) {
    const handlePress = useCallback(async (url: any) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Không thể mở đường dẫn: ${url}`);
        }
    }, []);
    return (
        <>
            <ScrollView className='px-[13px]'>
                <View className='mt-3'>
                    <Image className='h-[250px] rounded-[10px]' source={{ uri: `${SERVER_URL}${postThumb}` }} alt='Ảnh banner' resizeMode='cover' />
                </View>
                <View className='mt-3'>
                    <Text className='text-black font-psemibold text-[20px]'>{postTitle}</Text>
                </View>
                <View className='mt-3'>
                    <Text className='text-[#737373] font-psemibold text-[14px]'>{formatDateTime(postTime)}</Text>
                </View>
                <View className='mt-3'>
                    <Text className='text-black font-pregular text-[14px]'>{postContent}</Text>
                </View>
                <View className='h-[60px]'></View>
            </ScrollView>
            <View className='absolute bottom-2' style={{ left: width / 2 - 81 }}>
                <CustomButton
                    title="Tìm hiểu thêm"
                    handlePress={() => handlePress(postUrl)}
                    containerStyles="w-[162px]"
                    buttonStyle="rounded-[6px]  min-h-[50px]"
                    colorFrom="#1560A1"
                    colorTo="#4FAA57"
                    textStyles="text-white font-psemibold text-[16px]"
                />
            </View>
        </>
    )
}
