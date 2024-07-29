import { View, Text } from 'react-native'
import React, { useState } from 'react'
import TabButtons, { TabButtonType } from '@/components/common/TabButtons';
import KienThucBaiVietScreen from './kienThucBaiViet.screen';
import KienThucVideoScreen from './kienThucVideo';
export enum CustomTab {
    Tab1,
    Tab2
}
export default function KienThucScreen() {
    const [selected, setSelected] = useState<CustomTab>(CustomTab.Tab1);
    const buttons: TabButtonType[] = [
        {
            title: 'Bài viết'
        },
        {
            title: 'Video'
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
                            <KienThucBaiVietScreen />
                        )
                        :
                        (
                            <KienThucVideoScreen />
                        )
                }
            </View>
        </View>
    )
}