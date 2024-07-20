import { View, Text } from 'react-native'
import React from 'react'
import CustomHeader from '@/components/common/CustomHeader'
import { useRoute } from '@react-navigation/native';

export default function HopDongDetailScreen() {
  const route = useRoute();
  const {
      headerTitle,
  }: any = route.params;
  return (
    <>
      <CustomHeader title={headerTitle} customStyle="bg-transparent" downloadBtn={true} />
    </>
  )
}