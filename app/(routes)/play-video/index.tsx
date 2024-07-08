import React from 'react'
import { useRoute } from "@react-navigation/native";
import PlayVideoScreen from '@/screens/video/playVideo.screen';
export default function PlayVideo() {
    const route = useRoute();
    const { videoItem, headerTitle }: any = route.params;
    return (
        <PlayVideoScreen headerTitle={headerTitle} videoItem={videoItem} />
    )
}