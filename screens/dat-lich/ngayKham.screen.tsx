import { View, Text } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import CustomButton from '@/components/common/CustomButton';
import CalendarComponent from '@/components/common/CalendarComponent';
type ServiceProps = {
    setSelectedDate: (date: string) => void;
    onDatLichPress: (index: number) => void;
    onBackPress: () => void;
    selectedDate: string;
    loading: boolean;
}

export default function NgayKhamScreen({ setSelectedDate, selectedDate, onDatLichPress, onBackPress, loading }: ServiceProps) {
    const handleDayPress = (day: any) => {
        setSelectedDate(day.dateString);
    };
    return (
        <View className='mt-[17px]'>
            <Text className='text-center font-semibold text-[20px] mb-[8px]'>Quý khách vui lòng chọn ngày khám</Text>
            <View className='h-[90%]'>
                <CalendarComponent selectedDate={selectedDate} disableArrowLeft={true} enableDayClick={true} hideExtraDays={true} showSixWeeks={true} minDate={true} markedDates={{}} onMonthChange={() => { } } lichHenSapToi={{}} handleDayPress={handleDayPress} flag={false} />
                <View className='my-[90px] flex-row justify-evenly'>
                    <CustomButton
                        title="Quay lại"
                        handlePress={onBackPress}
                        containerStyles="w-[166px]"
                        icon={icons.backArrow}
                        buttonStyle="rounded-full min-h-[50px] bg-[#EDEDED] border-[#D7D7D7] border-[1px]"
                        textStyles=" font-pextrabold text-[16px] text-[#747474]"
                        iconStyle="w-[25px] h-[16px] mr-[12px]" flag={false} isLoading={undefined} colorFrom={undefined} colorTo={undefined} iconRight={undefined} />
                    <CustomButton
                        title="Đặt lịch"
                        handlePress={() => onDatLichPress(2)}
                        icon={icons.nextArrow}
                        iconRight={true}
                        containerStyles="w-[166px]"
                        buttonStyle="rounded-full min-h-[50px]"
                        colorFrom="#1560A1"
                        colorTo="#4FAA57"
                        textStyles="text-white font-pextrabold text-[16px]"
                        iconStyle="w-[25px] h-[16px] ml-[12px]"
                        isLoading={loading} flag={false} />
                </View>
            </View>
        </View>
    )
}
