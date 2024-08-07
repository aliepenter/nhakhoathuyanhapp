import React, { useEffect, useState } from 'react'
import TabButtons, { TabButtonType } from '@/components/common/TabButtons';
import CustomHeader from '@/components/common/CustomHeader';
import { View, Text, ActivityIndicator } from 'react-native';
import MyGalleryScreen from './myGallery.screen';
import QuaTrinhScreen from './quaTrinh.screen';
import useUser from '@/hooks/auth/useUser';
import { icons } from '@/constants';

export enum CustomTab {
  Tab1,
  Tab2
}
export default function ImageGalleryScreen() {
  const { user } = useUser();
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
    <View className='bg-white h-full'>
      <View className='px-[11px] mt-2'>
        <TabButtons buttons={buttons} selectedTab={selected} setSelectedTab={setSelected} iconIndex0={icons.galleryWhite} iconIndex1={icons.chinhNhaWhite}/>
        {
          selected === CustomTab.Tab1
            ?
            (
              <MyGalleryScreen user={user} />
            )
            :
            (
              <QuaTrinhScreen user={user} />
            )
        }
      </View>
    </View>
  )
}