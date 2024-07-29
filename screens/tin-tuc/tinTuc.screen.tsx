import { View, Text, RefreshControl, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getOnlyPosts } from '@/lib/apiCall';
import { SERVER_URL } from '@/utils/uri';
import { router } from 'expo-router';
import PostItem from '@/components/common/PostItem';

export default function TinTucScreen() {
    const [post, setPost] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState<boolean>(false);

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
            const postData = await getOnlyPosts();

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
                        return <PostItem loading={loading} post={post} flag={flag} setFlag={setFlag} />
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