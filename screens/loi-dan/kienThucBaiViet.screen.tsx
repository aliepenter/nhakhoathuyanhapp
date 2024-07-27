import { RefreshControl, FlatList, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getOnlyLoiDan } from '@/lib/apiCall';
import PostItem from '@/components/common/PostItem';
import SearchInput from '@/components/common/SearchInput';

export default function KienThucBaiVietScreen() {
    const [loiDanVBaiViet, setLoiDanVBaiViet] = useState<Array<Post>>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchLoiDanBaiViet();

        setRefreshing(false);
    }
    useEffect(() => {
        fetchLoiDanBaiViet();
    }, []);
    const fetchLoiDanBaiViet = async () => {
        try {
            const loiDanBaiViet = await getOnlyLoiDan();
            setTimeout(() => {
                if (loiDanBaiViet) {
                    setLoiDanVBaiViet(loiDanBaiViet.data);
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
            <SearchInput placeholder="Tìm kiếm bài viết" />
            <FlatList
                data={[{ key: 'postList' }, { key: 'empty' }]}
                renderItem={({ item }) => {
                    switch (item.key) {
                        case 'postList':
                            return <PostItem loading={loading} post={loiDanVBaiViet} />
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