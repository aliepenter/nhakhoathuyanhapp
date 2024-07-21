import React from 'react'
import {
    Image,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { icons } from "@/constants";
import { Link, router } from "expo-router";
import Trending from '../common/Trending';
export default function RenderVideo({ videos }: any) {
    const handleViewAllNews = () => {
        router.push("/(routes)/video/");
    }
    return (
        <View className="px-[11px] space-y-6 mt-[27px] h-[230px]">
            <View className="w-full flex-1">
                <View className="justify-between items-start flex-row md:mb-[10px]">
                    <View className="flex-row">
                        <Image source={icons.verticalLine} className='w-[3px] h-[20px] mr-[8px] top-[3px]' resizeMode='contain' />
                        <Text className="text-[#5EBA1B] text-[16px] font-pbold mb-3 md:text-[22px]">
                            Video nổi bật
                        </Text>
                    </View>
                    <View className="mt-1.5">
                        <TouchableOpacity
                            onPress={handleViewAllNews}
                        >
                            <Text
                                className="text-[12px] md:text-[16px] font-pregular text-[#FF2D2D]"
                            >
                                Xem tất cả
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {videos && videos.length != 0
                    ?
                    <Trending posts={videos ?? []} />
                    :
                    <View className="h-48 justify-center">
                        <ActivityIndicator />
                    </View>
                }
            </View>
        </View>
    )
}