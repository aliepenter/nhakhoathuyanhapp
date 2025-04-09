import { View, Text } from 'react-native'
import React from 'react'
import TinTucDetailScreen from '@/screens/tin-tuc/tinTucDetail.screen';
import { useLocalSearchParams } from 'expo-router';
export default function tinTucDetail() {
    const { postThumb, postTime, postTitle, postContent, postUrl }: any = useLocalSearchParams();
    return (
        <TinTucDetailScreen postThumb={postThumb} postTime={postTime} postTitle={postTitle} postContent={postContent} postUrl={postUrl} />
    )
}