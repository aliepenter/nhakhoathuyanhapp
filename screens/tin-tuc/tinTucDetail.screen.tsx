import { View, Text, ScrollView, Image, Linking, Alert, Pressable } from 'react-native'
import React, { useCallback } from 'react'
import { SERVER_URL } from '@/utils/uri'
import CustomButton from '@/components/common/CustomButton';
import { formatDateTime } from '@/lib/commonFunctions';
export default function TinTucDetailScreen({ postThumb, postTime, postTitle, postContent, postUrl }: any) {
    const sourceLinks = String(postUrl || '')
        .split(/[\n,;|]+/)
        .map((item) => item.trim())
        .filter((item) => /^https?:\/\//i.test(item))
        .filter(Boolean);

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
                <View className='mt-4 p-3 bg-[#F4F9FF] rounded-[10px] border border-[#D7E8FF]'>
                    <Text className='text-black font-psemibold text-[15px]'>Nguồn tham khảo y khoa</Text>
                    {
                        sourceLinks.length > 0
                            ? sourceLinks.map((link, index) => (
                                <Pressable key={`${link}-${index}`} onPress={() => handlePress(link)}>
                                    <Text className='text-[#1560A1] font-pregular text-[13px] mt-2 underline'>
                                        [{index + 1}] {link}
                                    </Text>
                                </Pressable>
                            ))
                            : <Text className='text-[#6B7280] font-pregular text-[13px] mt-2'>Nguồn đang được cập nhật.</Text>
                    }
                </View>
                <View className='mt-3'>
                    <Text className='text-black font-pregular text-[14px]'>{postContent}</Text>
                </View>
                <View className='mt-4 p-3 bg-[#FFF7ED] rounded-[10px] border border-[#FED7AA]'>
                    <Text className='text-[#9A3412] font-pregular text-[13px]'>
                        Nội dung chỉ mang tính chất tham khảo, không thay thế chẩn đoán hoặc chỉ định điều trị từ bác sĩ.
                    </Text>
                </View>
                {
                    sourceLinks.length > 0 && (
                        <View className='mt-4 mb-8'>
                            <CustomButton
                                title="Mở nguồn tham khảo"
                                handlePress={() => handlePress(sourceLinks[0])}
                                containerStyles="w-[190px]"
                                buttonStyle="rounded-[6px] min-h-[50px]"
                                colorFrom="#1560A1"
                                colorTo="#4FAA57"
                                textStyles="text-white font-psemibold text-[16px]" flag={false} iconStyle={undefined} icon={undefined} isLoading={undefined} iconRight={undefined} notification={false} />
                        </View>
                    )
                }
                <View className='h-[20px]'></View>
            </ScrollView>
        </>
    )
}
