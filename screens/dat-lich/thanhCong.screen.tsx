import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import CustomButton from '@/components/common/CustomButton'
import { router } from 'expo-router'
type ServiceProps = {
    selectDate: string;
    serviceName: string;
}
export default function ThanhCongScreen({ selectDate, serviceName }: ServiceProps) {
    const onPress = () => {
        router.dismissAll();
        router.replace("/(tabs)");
    }
    function formatDate(inputDate: string) {
        const date = new Date(inputDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return (
        <View className='justify-center items-center h-[90%] px-[52px]'>
            <Image source={icons.thanhCong} className='w-[114px] h-[114px]' resizeMode='cover' />
            <Text className='uppercase text-[18px] font-pextrabold text-[#51B81A] mt-[15px] mb-[23px]'>Đặt lịch thành công</Text>
            <Text className='text-[15px] font-pmedium text-[#828282] text-center mb-20'>
                {`Yêu cầu đặt lịch khám `}<Text className='font-pbold'>{serviceName}</Text>{` của quý khách vào ngày ${formatDate(selectDate)} đã được gửi đi. Chúng tôi sẽ liên hệ lại với quý khách trong thời gian sớm nhất. Cảm ơn quý khách đã tin tưởng Nha khoa Thùy Anh!`}
            </Text>
            <CustomButton
                title="Hoàn tất"
                handlePress={onPress}
                containerStyles="w-[140px]"
                buttonStyle="rounded-full min-h-[50px]"
                colorFrom="#1560A1"
                colorTo="#4FAA57"
                textStyles="text-white font-pextrabold text-[16px]"
                iconStyle="w-[25px] h-[16px] ml-[12px]" flag={false} icon={undefined} isLoading={undefined} iconRight={undefined} notification={false} />
        </View>
    )
}