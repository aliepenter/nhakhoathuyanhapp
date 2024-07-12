import React, { useState } from 'react'
import TabButtons, { TabButtonType } from '@/components/gallery/TabButtons';
import CustomHeader from '@/components/common/CustomHeader';
import { icons } from '@/constants';
import { View, Text } from 'react-native';
import MyGalleryScreen from './myGallery.screen';
import QuaTrinhScreen from './quaTrinh.screen';

export enum CustomTab {
  Tab1,
  Tab2
}
export default function ImageGalleryScreen() {
  const [selected, setSelected] = useState<CustomTab>(CustomTab.Tab1);
  const buttons: TabButtonType[] = [
    {
      title: 'Thư viện của bạn'
    },
    {
      title: 'Quá trình chỉnh nha'
    }
  ]
  return (
    <View className='bg-white'>
      <CustomHeader customStyle="bg-white" title="Thư viện nụ cười" />
      <View className='px-[11px] mt-2'>
        <TabButtons buttons={buttons} selectedTab={selected} setSelectedTab={setSelected} />
        <View className=''>
          {
            selected === CustomTab.Tab1
              ?
              (
                <MyGalleryScreen />
              )
              :
              (
                <QuaTrinhScreen />
              )
          }
        </View>
      </View>
    </View>
  )
}