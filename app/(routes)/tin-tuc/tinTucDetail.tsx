import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import TinTucDetailScreen from '@/screens/tin-tuc/tinTucDetail.screen';

export default function tinTucDetail() {
    const route = useRoute();
    const { postThumb, postTime, postTitle, postContent, postUrl }: any = route.params;
    return (
        <TinTucDetailScreen postThumb={postThumb} postTime={postTime} postTitle={postTitle} postContent={postContent} postUrl={postUrl} />
    )
}