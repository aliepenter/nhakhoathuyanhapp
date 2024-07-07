import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPosts } from '@/lib/apiCall';
import { SERVER_URL } from '@/utils/uri';

export default function TinTucScreen() {
    const [post, setPost] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchNews();
        setRefreshing(false);
    };
    useEffect(() => {
        fetchNews();
    }, []);
    const fetchNews = async () => {
        try {
            const postData = await getPosts();

            setTimeout(() => {
                if (postData) {
                    setLoading(false)
                    setPost(postData.data);
                } else {
                    setLoading(false);
                }
            }, 1000);

        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    };

    return (
        <FlatList
            data={[{ key: 'postList' }]}
            renderItem={({ item }) => {
                switch (item.key) {
                    case 'postList':
                        return <PostItem loading={loading} post={post} />
                    default:
                        return null;
                }
            }}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            className="bg-white h-full"
        />
    )
}

const PostItem = ({ loading, post }: any) => {
    return (
        !loading
            ?
            post && post.length != 0
                ?
                <View className='flex-row flex-wrap pt-[25px]'>
                    {
                        post.map((item: Post, index: number) => (
                            <TouchableOpacity
                                key={index}
                                className={`px-[11px] mb-[15px] w-[50%] md:w-[33.333%]`}
                                activeOpacity={0.7}
                                onPress={() => { }}
                            >
                                <Image
                                    source={{ uri: `${SERVER_URL}${item.banner_id.banner_path}` }}
                                    className="h-[135px] md:h-[200px] w-full rounded-[10px] mb-[5px]"
                                />
                                <Text className='font-semibold text-[12px]'>{item.title}</Text>
                            </TouchableOpacity>
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