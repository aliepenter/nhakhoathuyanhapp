import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import { LinearGradient } from 'expo-linear-gradient'

export default function TimeTracking() {
    return (
        <View className='flex-row flex-1 justify-between px-[11px] mt-[20px]'>
            <LinearGradient
                colors={['#1560A1', '#4FAA57']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className={`w-[48%] h-[59px] rounded-[10px] justify-center items-center`}
            >
                <View className='flex-row items-center justify-center'>
                    <Image source={icons.calenderMonth} className='w-[16px] h-[16px] mr-[3px]' resizeMode='contain' />
                    <Text className='font-pbold font-[12px] text-white'>Lịch hẹn sắp tới</Text>
                </View>
                <Text className='font-pextrabold text-[#FBFF49] font-[16px]'>07/07/2024</Text>
            </LinearGradient>
            <LinearGradient
                colors={['#1560A1', '#4FAA57']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className={`w-[48%] h-[59px] rounded-[10px] justify-center items-center`}
            >
                <View className='flex-row items-center justify-center'>
                    <Image source={icons.calenderDay} className='w-[16px] h-[16px] mr-[3px]' resizeMode='contain' />
                    <Text className='font-pbold font-[12px] text-white'>Thời gian niềng răng</Text>
                </View>
                <Text className='font-pextrabold text-[#FBFF49] font-[16px]'>250 ngày</Text>
            </LinearGradient>
        </View>
    )
}