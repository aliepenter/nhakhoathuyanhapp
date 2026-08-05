import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { getDichVuKhac } from '@/lib/apiCall';
import { formatMoney } from '@/lib/commonFunctions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DichVuKhac({ chinh_nha_id, order, onHasContentChange }: any) {
    const [dichVuKhac, setDichVuKhac] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchDichVuKhac = useCallback(async () => {
        setLoading(true);
        setDichVuKhac([]);
        try {
            if (!chinh_nha_id) {
                onHasContentChange?.(false);
                return;
            }

            const res = await getDichVuKhac(chinh_nha_id);
            const data = res?.data || [];
            setDichVuKhac(data);
            onHasContentChange?.(data.length > 0);
        } catch (error) {
            console.error("Error fetching data:", error);
            onHasContentChange?.(false);
        } finally {
            setLoading(false);
        }
    }, [chinh_nha_id, onHasContentChange]);

    useEffect(() => {
        fetchDichVuKhac();
    }, [fetchDichVuKhac]);

    if (loading) {
        return (
            <View style={styles.loadingWrap}>
                <ActivityIndicator color={'#00E5E5'} />
            </View>
        )
    }

    if (dichVuKhac.length === 0) {
        return null;
    }

    const totalAmount = dichVuKhac.reduce((total, item) => total + Number(item.gia_thanh || 0), 0);

    return (
        <View style={styles.section}>
            <View style={styles.titleWrap}>
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons name="cash-multiple" size={20} color="#9A5B00" />
                </View>
                <View style={styles.titleTextWrap}>
                    <Text style={styles.title}>{order}. Chi phí dịch vụ khác</Text>
                    <Text style={styles.subtitle}>{dichVuKhac.length} dịch vụ phát sinh</Text>
                </View>
            </View>
            <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Tổng chi phí</Text>
                <Text style={styles.totalValue}>{formatMoney(totalAmount)}</Text>
            </View>
            <ScrollView style={styles.serviceList}>
                <DichVuKhacListItem dichVuKhac={dichVuKhac} />
            </ScrollView>
        </View>

    )
}

const DichVuKhacListItem = ({ dichVuKhac }: any) => {
    return <>
        {
            dichVuKhac && dichVuKhac.length !== 0
                ?
                <>
                    {
                        dichVuKhac.map((item: any, index: number) => (
                            <DichVuKhacItem key={index} item={item} />
                        ))
                    }
                </>
                :
                <View style={styles.loadingWrap}>
                    <ActivityIndicator color={'#00E5E5'} />
                </View>
        }
    </>
}

const DichVuKhacItem = ({ item }: any) => {
    return (
        <View style={styles.serviceItem}>
            <View style={styles.serviceBullet} />
            <Text style={styles.serviceName}>{item.ten_dich_vu}</Text>
            <Text style={styles.servicePrice}>{formatMoney(item.gia_thanh)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        padding: 16,
    },
    loadingWrap: {
        justifyContent: 'center',
        paddingVertical: 18,
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FFF4DD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    titleTextWrap: {
        flex: 1,
    },
    title: {
        color: '#10240B',
        fontFamily: 'Inter-Bold',
        fontSize: 17,
    },
    subtitle: {
        color: '#768172',
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        marginTop: 2,
    },
    totalBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF9EE',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F6E0B7',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 10,
    },
    totalLabel: {
        color: '#6B4A12',
        fontFamily: 'Inter-SemiBold',
        fontSize: 13,
    },
    totalValue: {
        color: '#9A5B00',
        fontFamily: 'Inter-Bold',
        fontSize: 16,
    },
    serviceList: {
        maxHeight: 260,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAF8',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 8,
    },
    serviceBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D99922',
        marginRight: 10,
    },
    serviceName: {
        flex: 1,
        color: '#273022',
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        lineHeight: 19,
    },
    servicePrice: {
        color: '#D00000',
        fontFamily: 'Inter-Bold',
        fontSize: 14,
        marginLeft: 10,
    },
});
