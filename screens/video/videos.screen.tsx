import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import VideoItem from '@/components/common/VideoItem';
import { getVideos } from '@/lib/apiCall';
import SearchInput from '@/components/common/SearchInput';

export default function VideosScreen() {
    const [videos, setVideos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [flag, setFlag] = useState<boolean>(false);

    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchVideos();
        setRefreshing(false);
    };
    useEffect(() => {
        fetchVideos();
    }, []);
    const fetchVideos = async () => {
        try {
            const videosData = await getVideos();

            setTimeout(() => {
                if (videosData) {
                    setLoading(false)
                    setVideos(videosData.data);
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
            <SearchInput placeholder="Tìm kiếm video" />
            <FlatList
                data={[{ key: 'videosList' }]}
                renderItem={({ item }) => {
                    switch (item.key) {
                        case 'videosList':
                            return <VideoItem loading={loading} post={videos} flag={flag} setFlag={setFlag} />
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