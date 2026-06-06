import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useUser from '@/hooks/auth/useUser';
import { getReferralList } from '@/lib/apiCall';

type ReferralItem = {
    id: number;
    referred_name: string;
    commission: number;
    status: 'paid' | 'unpaid';
    created_at: string;
}

const formatCommission = (amount: number): string => {
    if (amount >= 1000000) {
        const millions = amount / 1000000;
        return millions % 1 === 0 ? `${millions}tr đ` : `${(amount / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ`;
    }
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k đ`;
    return `${amount}đ`;
};

export default function GioiThieuChiTietScreen() {
    const { user } = useUser();
    const [list, setList] = useState<ReferralItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchList = useCallback(async () => {
        if (!user) return;
        const res = await getReferralList(user.id);
        if (res && res.data) {
            setList(res.data);
        } else {
            setList([]);
        }
        setLoading(false);
        setRefreshing(false);
    }, [user]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchList();
    };

    const renderItem = ({ item }: { item: ReferralItem }) => (
        <View className='bg-white mx-4 mb-3 rounded-2xl p-4 flex-row items-center justify-between' style={styles.card}>
            <View className='flex-1'>
                <Text className='font-psemibold text-[14px] text-[#333]' numberOfLines={1}>
                    {item.referred_name}
                </Text>
                <Text className='font-pregular text-[12px] text-[#888] mt-1'>
                    Hoa hồng: <Text className='font-psemibold text-[#1361AA]'>{formatCommission(item.commission)}</Text>
                </Text>
            </View>
            <View
                style={item.status === 'paid' ? styles.badgePaid : styles.badgeUnpaid}
                className='px-3 py-1 rounded-full ml-3'
            >
                <Text
                    className='text-[11px] font-psemibold'
                    style={{ color: item.status === 'paid' ? '#2E7D32' : '#B45309' }}
                >
                    {item.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className='flex-1 justify-center items-center bg-[#F5F5F5]'>
                <ActivityIndicator size="large" color="#1361AA" />
            </View>
        );
    }

    return (
        <FlatList
            data={list}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32, flexGrow: 1 }}
            style={{ backgroundColor: '#F5F5F5' }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1361AA']} />}
            ListEmptyComponent={
                <View className='flex-1 justify-center items-center mt-20'>
                    <Text className='font-pregular text-[14px] text-[#aaa]'>Bạn chưa có lượt giới thiệu nào.</Text>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    badgePaid: {
        backgroundColor: '#E8F5E9',
    },
    badgeUnpaid: {
        backgroundColor: '#FEF3C7',
    },
})
