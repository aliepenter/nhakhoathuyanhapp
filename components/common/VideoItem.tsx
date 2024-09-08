import { Text, View, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { SERVER_URL } from '@/utils/uri';
import { images } from '@/constants';
import { Image } from 'expo-image'
type VideoItemProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    post: any;
    loading: boolean;
}
export default function VideoItem({ loading, post, flag, setFlag }: VideoItemProps) {
    const onPress = (item: any) => {
        if (item) {
            setFlag(true);
            router.push({
                pathname: "/(routes)/play-video",
                params: { videoItem: item.video_url, headerTitle: item.video_title },
            });
            setTimeout(() => {
                setFlag(false)
            }, 1000);
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
                            <Pressable
                                key={index}
                                className={`px-[11px] mb-[15px] w-full`}
                                onPress={() => onPress(item)}
                                disabled={flag}
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
                            </Pressable>
                        ))
                    }
                </View>
                :
                <View className='justify-center items-center h-96'>
                    <Text>Không có dữ liệu video</Text>
                </View>
            :
            <View className="h-96 justify-center items-center">
                <ActivityIndicator color={'#00E5E5'} />
            </View>
    )
}