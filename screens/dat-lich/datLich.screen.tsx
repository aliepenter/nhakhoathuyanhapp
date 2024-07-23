import { View, Text } from 'react-native'
import React, { useState } from 'react'
import StatusButton, { StatusButtonType } from '@/components/common/StatusButton';
import DichVuScreen from './dichVu.screen';
export enum StatusTab {
    Tab1,
    Tab2,
    Tab3
}
export default function DatLichScreen() {
    const [selected, setSelected] = useState<StatusTab>(StatusTab.Tab1);
    const buttons: StatusButtonType[] = [
        {
            title: 'Chọn dịch vụ'
        },
        {
            title: 'Chọn ngày khám'
        },
        {
            title: 'Đặt lịch khám'
        }
    ]
    return (
        <View className='bg-white h-full'>
            <View className='px-[11px] mt-[16px]'>
                <StatusButton buttons={buttons} selectedTab={selected} />
                {
                    selected === StatusTab.Tab1
                        ?
                        (
                            <DichVuScreen />
                        )
                        :
                        selected === StatusTab.Tab2
                            ?
                            (
                                <></>
                            )
                            :
                            (
                                <></>
                            )
                }
            </View>
        </View>
    )
}