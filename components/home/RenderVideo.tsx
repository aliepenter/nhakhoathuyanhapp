import React from 'react'
import {
    Image,
    Text,
    View,
    ActivityIndicator,
    Pressable,
    FlatList,
} from "react-native";
import { icons } from "@/constants";
import { Link, router } from "expo-router";
import VideoSection from '../common/VideoSection';
type RenderVideoProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    videos: any;
}
export default function RenderVideo({ videos, flag, setFlag }: RenderVideoProps) {
    const handleViewAllNews = () => {
        setFlag(true);
        router.push({
            pathname: "/(routes)/video"
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);
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
                        <Pressable
                            disabled={flag}
                            onPress={handleViewAllNews}
                        >
                            <Text
                                className="text-[12px] md:text-[16px] font-pregular text-[#FF2D2D]"
                            >
                                Xem tất cả
                            </Text>
                        </Pressable>
                    </View>
                </View>
                {videos && videos.length != 0
                    ?
                    <FlatList
                        data={videos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <VideoSection item={item} isLast={index === videos.length - 1} flag={flag} setFlag={setFlag} customImageStyle={''} />
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                    :
                    <View className="h-48 justify-center">
                        <ActivityIndicator color={'#00E5E5'} />
                    </View>
                }
            </View>
        </View>
    )
}