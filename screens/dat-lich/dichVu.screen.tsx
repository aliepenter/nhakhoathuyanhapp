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
                        {services.map((service: { id: React.Key | null | undefined; activeIcon: string | number | ImageSource | ImageSource[] | string[] | null | undefined; icon: string | number | ImageSource | ImageSource[] | string[] | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                            <TouchableOpacity
                                key={service.id}
                                className='w-[33.333333%] justify-center items-center'
                                onPress={() => handleServiceSelect(service.id)}
                            >
                                <Image
                                    className='w-[97px] h-[97px]'
                                    source={selectedServiceId === service.id ? service.activeIcon : service.icon}
                                    contentFit='cover'
                                />
                                <Text className='font-pregular text-[11px]'>
                                    {service.name}
                                </Text>
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
                            iconStyle="w-[25px] h-[16px] ml-[12px]"
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}
