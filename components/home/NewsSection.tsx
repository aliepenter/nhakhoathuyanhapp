import {
    Image,
    Text,
    View,
    ActivityIndicator,
} from "react-native";
import React from "react";
import { icons } from "@/constants";
import { Link } from "expo-router";
import { SERVER_URL } from "@/utils/uri";

export default function NewsSection({banners}: any) {
    return (
        <View className="mb-[100px] px-[11px] space-y-6 mt-[27px]">
            <View className="w-full flex-1">
                <View className="justify-between items-start flex-row">
                    <View className="flex-row">
                        <Image source={icons.verticalLine} className='w-[3px] h-[20px] mr-[8px] top-[3px]' resizeMode='contain' />
                        <Text className="text-[#5EBA1B] text-[16px] font-pbold mb-3">
                            Tin tức nổi bật
                        </Text>
                    </View>
                    <View className="mt-1.5">
                        <Link
                            href="/sign-up"
                            className="text-[12px] font-pregular text-[#FF2D2D]"
                        >
                            Xem tất cả
                        </Link>
                    </View>
                </View>
                {banners.length != 0
                    ?
                    <View className="flex-wrap flex-row justify-between">
                        {banners.map((item: Banner, index: number) => (
                            item.status === 2
                                ?
                                <Image
                                    key={index}
                                    source={{ uri: `${SERVER_URL}${item.banner_path}` }}
                                    className="h-[142px] w-[49%] rounded-[10px] mb-5"
                                />
                                :
                                null
                        ))}
                    </View>
                    :
                    <View className="h-[324px] justify-center">
                        <ActivityIndicator />
                    </View>
                }
            </View>
        </View>
    )
}