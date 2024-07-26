import { View, Text, Pressable, Image, LayoutChangeEvent } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '@/constants';

export type StatusButtonType = {
    title: string;
}

type StatusButtonProps = {
    buttons: StatusButtonType[];
    selectedTab: number;
}
export default function StatusButton({ buttons, selectedTab }: StatusButtonProps) {
    return (
        <View className='flex-row justify-evenly'>
            <View className='h-[2px] w-[60%] top-[28%] left-[20%] absolute bg-[#9E9E9E]'></View>
            {
                buttons.map((button, index) => {
                    return (
                        <View key={index} className='justify-center items-center'>
                            <View className={`${selectedTab !== index ? 'bg-[#E1E1E1]' : 'bg-[#51B81A]'} w-[25px] h-[25px] justify-center items-center rounded-full`}>
                                <Text className={`${selectedTab !== index ? 'text-[#747474]' : 'text-[#FFFFFF]'} font-black text-[14px]`}>{index+1}</Text>
                            </View>
                            <Text className={`${selectedTab !== index ? 'text-[#6D6D6D]' : 'text-[#51B81A]'} font-pregular text-[10px] mt-[3px]`}>{button.title}</Text>
                        </View>
                    )
                })
            }
        </View>
    )
}
