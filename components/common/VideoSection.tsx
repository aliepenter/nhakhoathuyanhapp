import {
    TouchableOpacity,
    ImageBackground,
    Image,
} from "react-native";
import React from "react";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import { SERVER_URL } from "@/utils/uri";

export default function VideoSection({ item, isLast, customImageStyle }: any) {
    const onPress = () =>
        router.push({
            pathname: "(routes)/play-video",
            params: { videoItem: item.video_url, headerTitle: item.video_title },
        });
    return (
        <TouchableOpacity
            className={`relative justify-center items-center ${isLast ? "" : "mr-2"}`}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <ImageBackground
                source={item && item.video_thumbnail ? { uri: `${SERVER_URL}${item.video_thumbnail}` } : images.bannerDefault}
                className={`${customImageStyle ? customImageStyle : "w-80 h-48"} overflow-hidden rounded-[20px]`}
                resizeMode="stretch"
            />
            <Image
                source={icons.play}
                className="w-12 h-12 absolute"
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}