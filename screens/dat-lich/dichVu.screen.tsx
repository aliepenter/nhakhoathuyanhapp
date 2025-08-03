import { View, Text, Dimensions, Linking, Alert, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'
import CustomButton from '@/components/common/CustomButton';
import { Image, ImageSource } from 'expo-image';
import { runOnJS } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
type ServiceProps = {
    services: any;
    selectedServiceId: any;
    setSelectedTab: (index: number) => void
    handleServiceSelect: (index: any) => void;
}
export default function DichVuScreen({ services, selectedServiceId, handleServiceSelect, setSelectedTab }: ServiceProps) {
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
                        {services.map((service: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                            <TouchableOpacity
                                key={service.id}
                                className='w-[33.333333%] justify-center items-center'
                                onPress={() => handleServiceSelect(service.id)}
                            >
                                <View className={`w-[90px] h-[90px] rounded-lg justify-center items-center mb-2 ${
                                    selectedServiceId === service.id 
                                        ? 'bg-blue-500 border-2 border-blue-600' 
                                        : 'bg-gray-100 border-2 border-gray-200'
                                }`}>
                                    <Text className={`font-pbold text-center text-[12px] px-2 ${
                                        selectedServiceId === service.id ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        {service.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
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
