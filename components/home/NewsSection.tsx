import {
    Image,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import React from "react";
import { icons } from "@/constants";
import { Link, router } from "expo-router";
import { SERVER_URL } from "@/utils/uri";

export default function NewsSection({ post }: any) {
    const handleViewAllNews = () => {
        router.push("/(routes)/tin-tuc/");
    }
    return (
        <View className="mb-[100px] px-[11px] space-y-6 mt-[27px]">
            <View className="w-full flex-1">
                <View className="justify-between items-start flex-row md:mb-[10px]">
                    <View className="flex-row">
                        <Image source={icons.verticalLine} className='w-[3px] h-[20px] mr-[8px] top-[3px]' resizeMode='contain' />
                        <Text className="text-[#5EBA1B] text-[16px] font-pbold mb-3 md:text-[22px]">
                            Tin tức nổi bật
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
                {post && post.length != 0
                    ?
                    <View className="flex-wrap flex-row justify-between">
                        {post.slice(0, 6).map((item: Post, index: number) => (
                            <Image
                                key={index}
                                source={{ uri: `${SERVER_URL}${item.banner_id.banner_path}` }}
                                className="h-[142px] md:h-[200px] w-[49%] md:w-[32%] rounded-[10px] mb-5"
                            />
                        ))}
                    </View>
                    :
                    // 582 324
                    <View className="h-[486px] md:h-[440px] justify-center">
                        <ActivityIndicator />
                    </View>
                }
            </View>
        </View>
    )
}