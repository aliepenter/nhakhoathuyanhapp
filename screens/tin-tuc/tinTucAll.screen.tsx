import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPosts } from '@/lib/apiCall';
import PostItem from '@/components/common/PostItem';
import SearchInput from '@/components/common/SearchInput';

export default function TinTucAllScreen() {
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
        <View className='bg-white h-full px-[11px]'>
            <SearchInput placeholder="Tìm kiếm tin tức" />
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
        </View>

    )
}