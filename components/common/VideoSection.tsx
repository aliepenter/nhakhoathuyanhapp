import {
    ImageBackground,
    Pressable,
} from "react-native";
import React from "react";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import { SERVER_URL } from "@/utils/uri";
import { Image } from 'expo-image';
type VideoSectionProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    item: any;
    isLast: boolean;
    customImageStyle: any;
}
export default function VideoSection({ item, isLast, customImageStyle, flag, setFlag }: VideoSectionProps) {
    const onPress = () => {
        setFlag(true);
        router.push({
            pathname: "/(routes)/play-video",
            params: { videoItem: item.video_url, headerTitle: item.video_title },
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }
    return (
        <Pressable
            className={`${customImageStyle ? customImageStyle : "w-80 h-48"} relative justify-center items-center ${isLast ? "" : "mr-2"}`}
            onPress={onPress}
            disabled={flag}
        >
            <ImageBackground
                source={item && item.video_thumbnail ? { uri: `${SERVER_URL}${item.video_thumbnail}` } : images.bannerDefault}
                className={`w-full h-full overflow-hidden rounded-[20px]`}
                resizeMode="stretch"
            />
            <Image
                source={icons.play}
                className="w-12 h-12 absolute"
                contentFit="contain"
            />
        </Pressable>
    );
}