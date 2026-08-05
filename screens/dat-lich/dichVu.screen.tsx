import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import CustomButton from '@/components/common/CustomButton';
import { runOnJS } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

const CHINH_NHA_SERVICE_ID = '1';

type ServiceProps = {
    services: any;
    selectedServiceId: any;
    setSelectedTab: (index: number) => void
    handleServiceSelect: (index: any) => void;
    disabledChinhNha?: boolean;
}
export default function DichVuScreen({ services, selectedServiceId, handleServiceSelect, setSelectedTab, disabledChinhNha }: ServiceProps) {
    const onTabPress = (index: number) => {
        runOnJS(handlePress)(index);
    }

    const handlePress = (index: number) => {
        if (selectedServiceId != null) {
            setSelectedTab(index);
        } else {
            showToast();

        }
    };
    const showToast = () => {
        Toast.show({
            type: 'error',
            text1: 'Vui lòng chọn dịch vụ',
        });
    }
    return (
        <View className='mt-[17px]'>
            <Text className='text-center font-semibold text-[20px] mb-[8px]'>Mời quý khách chọn dịch vụ</Text>
            <View className='h-[90%]'>
                <ScrollView>
                    <View className='flex-row flex-wrap gap-y-[25px]'>
                        {services.map((service: { id: string; name: string }) => {
                            const isDisabled = disabledChinhNha && service.id === CHINH_NHA_SERVICE_ID;

                            return (
                                <TouchableOpacity
                                    key={service.id}
                                    className='w-[33.333333%] justify-center items-center'
                                    onPress={() => handleServiceSelect(service.id)}
                                    activeOpacity={isDisabled ? 1 : 0.7}
                                >
                                    <View className={`w-[90px] h-[90px] rounded-lg justify-center items-center mb-2 ${
                                        isDisabled
                                            ? 'bg-gray-100 border-2 border-gray-300 opacity-60'
                                            : selectedServiceId === service.id
                                                ? 'bg-blue-500 border-2 border-blue-600'
                                                : 'bg-gray-100 border-2 border-gray-200'
                                    }`}>
                                        <Text className={`font-pbold text-center text-[12px] px-2 ${
                                            selectedServiceId === service.id ? 'text-white' : 'text-gray-700'
                                        }`}>
                                            {service.name}
                                        </Text>
                                        {isDisabled && (
                                            <Text className='font-pregular text-center text-[10px] text-gray-500 mt-1 px-2'>
                                                Đổi trong Lịch hẹn
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <View className='my-[20px]'>
                        <CustomButton
                            title="Tiếp theo"
                            handlePress={() => onTabPress(1)}
                            icon={icons.nextArrow}
                            iconRight={true}
                            containerStyles="w-[166px]"
                            buttonStyle="rounded-full min-h-[50px]"
                            colorFrom="#1560A1"
                            colorTo="#4FAA57"
                            textStyles="text-white font-pextrabold text-[16px]"
                            iconStyle="w-[25px] h-[16px] ml-[12px]" flag={false} isLoading={undefined} notification={false} />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}
