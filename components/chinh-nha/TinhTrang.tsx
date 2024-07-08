import { View, Text } from 'react-native'
import React from 'react'

export default function TinhTrang({ tinhtrang }: any) {
    return (
        <View className='mt-[13px] border-b-[2px] pb-[11px] border-b-[#E9E9E9] md:pb-[20px]'>
            <Text className='text-[16px] md:text-[22px] font-pbold text-[#5EBA1B] mb-[4px] md:mb-[13px]'>3. Tình trạng răng miệng</Text>
            <View className={`${tinhtrang ? '' : 'flex justify-center items-center'}`}>
                <Text className={`${tinhtrang?'text-red-500 font-pbold':''} text-[14px] md:text-[20px] ml-5`}>{tinhtrang ? tinhtrang : "Không có dữ liệu"}</Text>
            </View>
        </View>
    )
}