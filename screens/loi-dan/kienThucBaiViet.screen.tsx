import { RefreshControl, FlatList, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getOnlyLoiDan } from '@/lib/apiCall';
import PostItem from '@/components/common/PostItem';
import SearchInput from '@/components/common/SearchInput';

export default function KienThucBaiVietScreen() {
    const [loiDanVBaiViet, setLoiDanVBaiViet] = useState<Array<Post>>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [flag, setFlag] = useState<boolean>(false);
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
            <View className='px-[11px] bg-white'>
                <SearchInput placeholder="Tìm kiếm bài viết" />
            </View>
            <FlatList
                data={[{ key: 'postList' }, { key: 'empty' }]}
                renderItem={({ item }) => {
                    switch (item.key) {
                        case 'postList':
                            return <PostItem flag={flag} setFlag={setFlag} loading={loading} post={loiDanVBaiViet} />
                        default:
                            return <></>;
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                className="bg-white h-full"
            />
        </>
    )
}