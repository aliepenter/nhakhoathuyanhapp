import { View, Text } from 'react-native'
import React from 'react'
import EmptyState from '../common/EmptyState';

export default function ThuThuat({ thuthuat }: any) {

    return (
        <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9] md:mt-[22px] md:pb-[20px]'>
            <Text className='text-[16px] md:text-[22px] font-pbold text-[#5EBA1B] mb-[4px] md:mb-[13px]'>1. Thủ thuật điều trị</Text>
            <View className={`${thuthuat ? '' : 'flex justify-center items-center'}`}>
                {thuthuat ? (
                    <Text className={`text-[14px] md:text-[20px] ml-5`}>{thuthuat}</Text>
                ) : (
                    <EmptyState text="Không có dữ liệu thủ thuật điều trị" />
                )}
            </View>
        </View>
    )
}