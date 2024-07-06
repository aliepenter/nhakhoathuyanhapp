import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import PlayVideoScreen from '@/screens/video/playVideo.screen';
export default function PlayVideo() {
    const navigation = useNavigation();
    const route = useRoute();
    const { videoItem, headerTitle }: any = route.params;
    
    // useEffect(() => {
    //     navigation.setOptions({
    //         headerTitle: headerTitle,
    //     });
    // }, []);
    return (
        <PlayVideoScreen videoItem={videoItem} />
    )
}