import { View, Text, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import { LinearGradient } from 'expo-linear-gradient'

export default function TimeTracking({ schedule, totalTime }: any) {
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
                    <Text className='font-pbold text-[12px] text-white md:text-[16px]'>Lịch hẹn sắp tới</Text>
                </View>
                {schedule
                    ?
                    <Text className='font-pextrabold text-[12px] text-[#FBFF49] md:text-[16px]'>{schedule}</Text>
                    :
                    <View className="h-[23px] justify-center">
                        <ActivityIndicator />
                    </View>
                }
            </LinearGradient>
            <LinearGradient
                colors={['#1560A1', '#4FAA57']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className={`w-[48%] h-[59px] rounded-[10px] justify-center items-center`}
            >
                <View className='flex-row items-center justify-center'>
                    <Image source={icons.calenderDay} className='w-[16px] h-[16px] mr-[3px]' resizeMode='contain' />
                    <Text className='font-pbold text-[12px] text-white md:text-[16px]'>Thời gian niềng răng</Text>
                </View>
                {totalTime >= 0
                    ?
                    <Text className='font-pextrabold text-[12px] text-[#FBFF49] md:text-[16px]'>{totalTime} ngày</Text>
                    :
                    <View className="h-[23px] justify-center">
                        <ActivityIndicator />
                    </View>
                }
            </LinearGradient>
        </View>
    )
}