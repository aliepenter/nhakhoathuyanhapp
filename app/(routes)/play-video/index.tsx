import React from 'react'
import PlayVideoScreen from '@/screens/video/playVideo.screen';
import { useLocalSearchParams } from 'expo-router';
export default function PlayVideo() {
    const { videoItem, headerTitle }: any = useLocalSearchParams();
    return (
        <PlayVideoScreen headerTitle={headerTitle} videoItem={videoItem} />
    )
}