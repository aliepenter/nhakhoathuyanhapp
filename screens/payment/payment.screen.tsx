import { View, Text } from 'react-native'
import React, { useState } from 'react'
import TabButtons, { TabButtonType } from '@/components/common/TabButtons';
import HoSoTraGopCnScreen from './hoSoTraGopCn.screen';
export enum CustomTab {
    Tab1,
    Tab2
}

export default function PaymentScreen() {
    const [selected, setSelected] = useState<CustomTab>(CustomTab.Tab1);
    const buttons: TabButtonType[] = [
        {
            title: 'Trả góp chỉnh nha'
        },
        {
            title: 'Dịch vụ khác'
        }
    ]
    return (
        <View className='bg-white h-full'>
            <View className='px-[11px] mt-2'>
                <TabButtons buttons={buttons} selectedTab={selected} setSelectedTab={setSelected} iconIndex0={null} iconIndex1={null} />
                {
                    selected === CustomTab.Tab1
                        ?
                        (
                            <HoSoTraGopCnScreen />
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