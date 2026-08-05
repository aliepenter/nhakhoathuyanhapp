import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import VideoSection from '../common/VideoSection'
import { getBaiVietByThuThuat, getChinhNhaThuThuatByChinhNhaId, getVideosByThuThuat } from '@/lib/apiCall';
import BaiVietSection from '../common/BaiVietSection';
import { MaterialCommunityIcons } from '@expo/vector-icons';
type LoiDanProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    chinh_nha_id: any;
    order: number;
    onHasContentChange?: (hasContent: boolean) => void;
}
export default function LoiDan({ chinh_nha_id, flag, setFlag, order, onHasContentChange }: LoiDanProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [videos, setVideos] = useState<any[]>([]); // State để lưu video.data
    const [baiViets, setBaiViets] = useState<any[]>([]); // State để lưu bài viết

    const fetchLoiDan = useCallback(async () => {
        setLoading(true);
        setVideos([]);
        setBaiViets([]);
        try {
            if (!chinh_nha_id) {
                onHasContentChange?.(false);
                return;
            }

            const res = await getChinhNhaThuThuatByChinhNhaId(chinh_nha_id);
            if (!res?.data || res.data.length === 0) {
                onHasContentChange?.(false);
                return;
            }

            const [baiVietsData, videosData] = await Promise.all([
                Promise.all(res.data.map((item: any) => getBaiVietByThuThuat(item.thu_thuat_id.id))),
                Promise.all(res.data.map((item: any) => getVideosByThuThuat(item.thu_thuat_id.id))),
            ]);
            const formattedBaiViets = baiVietsData
                .map(baiViet => baiViet.data)
                .flat()
                .map((item: any) => ({ bai_viet_id: item }));
            const formattedVideos = videosData
                .map(video => video.data)
                .flat()
                .map((item: any) => ({ video_id: item }));
            const hasContent = formattedVideos.length > 0 || formattedBaiViets.length > 0;

            setBaiViets(formattedBaiViets);
            setVideos(formattedVideos);
            onHasContentChange?.(hasContent);
        } catch (error) {
            console.error("Error fetching data:", error);
            onHasContentChange?.(false);
        } finally {
            setLoading(false);
        }
    }, [chinh_nha_id, onHasContentChange]);

    useEffect(() => {
        fetchLoiDan();
    }, [fetchLoiDan]);

    if (loading) {
    return (
        <View style={styles.loadingWrap}>
            <ActivityIndicator color={'#00E5E5'} />
        </View>
        )
    }

    if (videos.length === 0 && baiViets.length === 0) {
        return null;
    }

    return (
        <View style={styles.section}>
            <View style={styles.titleWrap}>
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#316BFF" />
                </View>
                <View style={styles.titleTextWrap}>
                    <Text style={styles.title}>{order}. Lời dặn sau điều trị</Text>
                    <Text style={styles.subtitle}>{videos.length + baiViets.length} nội dung chăm sóc tại nhà</Text>
                </View>
            </View>
            {videos.length > 0 && (
                <View style={styles.contentGroup}>
                    <Text style={styles.groupTitle}>Video hướng dẫn</Text>
                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.horizontalList}
                        showsHorizontalScrollIndicator={false}
                    >
                        {videos.map((item: any, index: number) => (
                            <VideoSection flag={flag} setFlag={setFlag} key={index} customImageStyle={`${videos.length === 1 ? "w-96 h-56" : ''}`} item={item.video_id} isLast={index === videos.length - 1} />
                        ))}
                    </ScrollView>
                </View>
            )}
            {baiViets.length > 0 && (
                <View style={styles.contentGroup}>
                    <Text style={styles.groupTitle}>Bài viết nên đọc</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    >
                        {baiViets.map((item: any, index: number) => (
                            <BaiVietSection flag={flag} setFlag={setFlag} key={index} customImageStyle={`${baiViets.length === 1 ? "w-96 h-56" : ''}`} item={item.bai_viet_id} isLast={index === baiViets.length - 1} />
                        ))}
                    </ScrollView>
                </View>
            )}
        </View >
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
        marginBottom: 10,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#EAF0FF',
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
    contentGroup: {
        marginTop: 12,
    },
    groupTitle: {
        color: '#475044',
        fontFamily: 'Inter-SemiBold',
        fontSize: 13,
        marginBottom: 8,
    },
    horizontalList: {
        paddingRight: 2,
    },
});
