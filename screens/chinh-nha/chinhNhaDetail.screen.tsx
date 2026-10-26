import { View, Text, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Keyboard, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomHeader from '@/components/common/CustomHeader';
import QuaTrinhImage from '@/components/chinh-nha/QuaTrinhImage';
import TinhTrang from '@/components/chinh-nha/TinhTrang';
import LoiDan from '@/components/chinh-nha/LoiDan';
import DichVuKhac from '@/components/chinh-nha/DichVuKhac';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '@/lib/commonFunctions';

const imageKeys = [
    'anh_1',
    'anh_2',
    'anh_3',
    'anh_4',
    'anh_5',
    'anh_6',
    'anh_7',
    'anh_8',
    'anh_9',
    'anh_10',
    'anh_11',
    'anh_12',
    'anh_13',
];

const safeParseJson = (value: any) => {
    if (!value) return null;
    try {
        return JSON.parse(value as string);
    } catch {
        return null;
    }
};

export default function ChinhNhaDetailScreen() {
    const [flag, setFlag] = useState<boolean>(false);
    const {
        qua_trinh_image_id,
        tinh_trang_rang_mieng,
        headerTitle,
        chinh_nha_id,
        ngay_chinh_nha
    }: any = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showLoiDan, setShowLoiDan] = useState(false);
    const [showDichVuKhac, setShowDichVuKhac] = useState(false);
    const [loiDanChecked, setLoiDanChecked] = useState(false);
    const [dichVuKhacChecked, setDichVuKhacChecked] = useState(false);
    const quaTrinhImage = safeParseJson(qua_trinh_image_id);
    const tinhTrang = safeParseJson(tinh_trang_rang_mieng)?.noi_dung;
    const hasQuaTrinhImage = !!quaTrinhImage && imageKeys.some((key) => !!quaTrinhImage[key]);
    const hasTinhTrang = typeof tinhTrang === 'string' ? tinhTrang.trim().length > 0 : !!tinhTrang;
    const availableSections = [
        hasQuaTrinhImage ? 'Ảnh quá trình' : null,
        hasTinhTrang ? 'Tình trạng' : null,
        showLoiDan ? 'Lời dặn' : null,
        showDichVuKhac ? 'Chi phí khác' : null,
    ].filter(Boolean);
    let sectionNumber = 1;
    const quaTrinhOrder = hasQuaTrinhImage ? sectionNumber++ : 0;
    const tinhTrangOrder = hasTinhTrang ? sectionNumber++ : 0;
    const loiDanOrder = showLoiDan ? sectionNumber++ : 0;
    const dichVuKhacOrder = showDichVuKhac ? sectionNumber++ : 0;
    const shouldExpandImageGallery = hasQuaTrinhImage && availableSections.length === 1 && loiDanChecked && dichVuKhacChecked;

    const handleLoiDanContentChange = useCallback((hasContent: boolean) => {
        setShowLoiDan(hasContent);
        setLoiDanChecked(true);
    }, []);

    const handleDichVuKhacContentChange = useCallback((hasContent: boolean) => {
        setShowDichVuKhac(hasContent);
        setDichVuKhacChecked(true);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        setRefreshing(false);
        setLoading(false);
    }
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };
    useEffect(() => {
        setLoading(false);
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                scrollToBottom();
            }
        );
        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        setShowLoiDan(false);
        setShowDichVuKhac(false);
        setLoiDanChecked(false);
        setDichVuKhacChecked(false);
    }, [chinh_nha_id]);
    return (
        <>
            <CustomHeader title={headerTitle} customStyle="bg-transparent" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, backgroundColor: '#F6F6F6' }}
            >
                {
                    !loading
                        ?
                        <ScrollView
                            ref={scrollViewRef}
                            style={{ flex: 1 }}
                            contentContainerStyle={styles.scrollContent}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <LinearGradient
                                colors={['#FFFFFF', '#F4FBF0']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.summaryCard}
                            >
                                <View style={styles.summaryHeader}>
                                    <View style={styles.summaryIconWrap}>
                                        <MaterialCommunityIcons name="calendar-heart" size={24} color="#3F9F16" />
                                    </View>
                                    <View style={styles.summaryTextWrap}>
                                        <Text style={styles.summaryEyebrow}>Hồ sơ buổi điều trị</Text>
                                        <Text style={styles.summaryTitle}>{ngay_chinh_nha ? formatDate(ngay_chinh_nha, 'minimize') : headerTitle}</Text>
                                    </View>
                                </View>
                                <View style={styles.summaryMeta}>
                                    <View style={styles.metaItem}>
                                        <Text style={styles.metaValue}>{availableSections.length}</Text>
                                        <Text style={styles.metaLabel}>mục có dữ liệu</Text>
                                    </View>
                                    <View style={styles.metaDivider} />
                                    <View style={styles.sectionTags}>
                                        {availableSections.length > 0 ? (
                                            availableSections.map((item) => (
                                                <View key={item} style={styles.sectionTag}>
                                                    <Text style={styles.sectionTagText}>{item}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={styles.pendingText}>Đang kiểm tra dữ liệu buổi điều trị</Text>
                                        )}
                                    </View>
                                </View>
                            </LinearGradient>
                            {hasQuaTrinhImage && (
                                <View style={styles.card}><QuaTrinhImage order={quaTrinhOrder} anh={quaTrinhImage} expanded={shouldExpandImageGallery} /></View>
                            )}
                            {hasTinhTrang && (
                                <View style={styles.card}><TinhTrang order={tinhTrangOrder} tinhtrang={tinhTrang} /></View>
                            )}
                            <View style={[styles.card, !showLoiDan && styles.hiddenCard]}>
                                <LoiDan
                                    order={loiDanOrder}
                                    chinh_nha_id={chinh_nha_id}
                                    flag={flag}
                                    setFlag={setFlag}
                                    onHasContentChange={handleLoiDanContentChange}
                                />
                            </View>
                            <View style={[styles.card, !showDichVuKhac && styles.hiddenCard]}>
                                <DichVuKhac
                                    order={dichVuKhacOrder}
                                    chinh_nha_id={chinh_nha_id}
                                    onHasContentChange={handleDichVuKhacContentChange}
                                />
                            </View>
                        </ScrollView>
                        :
                        <View style={{ backgroundColor: '#FAFAFA', flex: 1, justifyContent: 'center' }}>
                            <ActivityIndicator color={'#00E5E5'} />
                        </View>
                }
            </KeyboardAvoidingView>
        </>

    )
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 34,
    },
    summaryCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#DDF0D4',
        shadowColor: '#1B4312',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 2,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#E8F7E1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    summaryTextWrap: {
        flex: 1,
    },
    summaryEyebrow: {
        color: '#64705E',
        fontFamily: 'Inter-Medium',
        fontSize: 12,
    },
    summaryTitle: {
        color: '#10240B',
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        marginTop: 2,
    },
    summaryMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
    },
    metaItem: {
        minWidth: 78,
    },
    metaValue: {
        color: '#3F9F16',
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        lineHeight: 28,
    },
    metaLabel: {
        color: '#65715F',
        fontFamily: 'Inter-Regular',
        fontSize: 11,
    },
    metaDivider: {
        width: 1,
        height: 34,
        backgroundColor: '#DCE8D5',
        marginHorizontal: 12,
    },
    sectionTags: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    sectionTag: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D8E9CF',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    sectionTagText: {
        color: '#44613A',
        fontFamily: 'Inter-Medium',
        fontSize: 11,
    },
    pendingText: {
        color: '#64705E',
        fontFamily: 'Inter-Regular',
        fontSize: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 0,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E8ECE6',
        overflow: 'hidden',
    },
    hiddenCard: {
        display: 'none',
    },
});
