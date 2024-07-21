import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { SERVER_URL } from '@/utils/uri';
import { images } from '@/constants';
import { Image } from 'expo-image'
export default function VideoItem({ loading, post }: any) {
    const onPress = (item: any) => {
        if (item) {
            router.push({
                pathname: "(routes)/play-video",
                params: { videoItem: item.video_url, headerTitle: item.video_title },
            });
        }
    }
    return (
        !loading
            ?
            post && post.length != 0
                ?
                <View className={`flex-row flex-wrap pt-[25px]`}>
                    {
                        post.map((item: Video, index: number) => (
                            <TouchableOpacity
                                key={index}
                                className={`px-[11px] mb-[15px] w-full`}
                                activeOpacity={0.7}
                                onPress={() => onPress(item)}
                            >
                                <View className='w-full h-52 bg-gray-300 md:h-64 rounded-[10px]'>
                                    <Image
                                        source={item && item.video_thumbnail ? { uri: `${SERVER_URL}${item.video_thumbnail}` } : images.bannerDefault}
                                        className="h-52 md:h-64 w-full rounded-[10px] mb-[5px]"
                                        contentFit="cover"
                                        transition={500}

                                    />
                                </View>
                                <Text className='font-semibold text-[16px] text-center mt-[7px]'>{item.video_title}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                :
                <View className='justify-center items-center h-96'>
                    <Text>Không có dữ liệu video</Text>
                </View>
            :
            <View className="h-96 justify-center items-center">
                <ActivityIndicator />
            </View>
    )
}