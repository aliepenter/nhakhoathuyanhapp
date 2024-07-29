import { View, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchInput from '@/components/common/SearchInput';
import { getOnlyLoiDanVideo } from '@/lib/apiCall';
import VideoItem from '@/components/common/VideoItem';
export default function KienThucVideoScreen() {
    const [loiDanVideo, setLoiDanVideo] = useState<Array<Post>>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [flag, setFlag] = useState<boolean>(false);
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchLoiDanVideo();
        setRefreshing(false);
    }
    useEffect(() => {
        fetchLoiDanVideo();
    }, []);
    const fetchLoiDanVideo = async () => {
        try {
            const loiDanVideo = await getOnlyLoiDanVideo();
            setTimeout(() => {
                if (loiDanVideo) {
                    setLoiDanVideo(loiDanVideo.data);
                    setLoading(false)
                } else {
                    setLoading(false)
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
        <>
            <SearchInput placeholder="Tìm kiếm video" />
            <FlatList
                data={[{ key: 'postList' }, { key: 'empty' }]}
                renderItem={({ item }) => {
                    switch (item.key) {
                        case 'postList':
                            return <VideoItem loading={loading} post={loiDanVideo} flag={flag} setFlag={setFlag} />
                        default:
                            return <View className='h-40'></View>;
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                className="bg-white h-full"
            />
        </>
    )
}