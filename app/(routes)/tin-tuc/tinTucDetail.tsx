import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import TinTucDetailScreen from '@/screens/tin-tuc/tinTucDetail.screen';

export default function tinTucDetail() {
    const route = useRoute();
    const { postItem, headerTitle }: any = route.params;
    return (
        <TinTucDetailScreen headerTitle={headerTitle} postItem={postItem} />
    )
}