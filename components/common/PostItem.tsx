import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { SERVER_URL } from '@/utils/uri';
type PostItemProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    post: any;
    loading: boolean;
}
export default function PostItem({ loading, post, flag, setFlag }: PostItemProps) {
    const onPress = (item: any) => {
        if (item) {
            setFlag(true);
            router.push({
                pathname: "(routes)/tin-tuc/tinTucDetail",
                params: { postThumb: item.banner_id.banner_path, postTime: item.date, postTitle: item.title, postContent: item.content, postUrl: item.website_url },
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
                <View className='flex-row flex-wrap pt-[25px]'>
                    {
                        post.map((item: Post, index: number) => (
                            <Pressable
                                key={index}
                                disabled={flag}
                                className={`px-[11px] mb-[15px] w-[50%] md:w-[33.333%]`}
                                onPress={() => onPress(item)}
                            >
                                <Image
                                    transition={500}
                                    contentFit='contain'
                                    source={{ uri: `${SERVER_URL}${item.banner_id.banner_path}` }}
                                    className="h-[135px] md:h-[200px] w-full rounded-[10px] mb-[5px]"
                                />
                                <Text className='font-semibold text-[12px]'>{item.title}</Text>
                            </Pressable>
                        ))
                    }
                </View>
                :
                <View className='justify-center items-center h-96'>
                    <Text>Không có dữ liệu tin tức</Text>
                </View>
            :
            <View className="h-96 justify-center items-center">
                <ActivityIndicator />
            </View>

    )
}