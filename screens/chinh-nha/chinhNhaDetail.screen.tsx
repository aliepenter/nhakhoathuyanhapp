import { View, Text, FlatList, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Keyboard, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ThuThuat from '@/components/chinh-nha/ThuThuat';
import CustomHeader from '@/components/common/CustomHeader';
import QuaTrinhImage from '@/components/chinh-nha/QuaTrinhImage';
import TinhTrang from '@/components/chinh-nha/TinhTrang';
import LoiDan from '@/components/chinh-nha/LoiDan';
import DichVuKhac from '@/components/chinh-nha/DichVuKhac';
import DanhGiaDichVu from '@/components/chinh-nha/DanhGiaDichVu';
import { useLocalSearchParams } from 'expo-router';
export default function ChinhNhaDetailScreen() {
    const [flag, setFlag] = useState<boolean>(false);
    const {
        thu_thuat_dieu_tri,
        qua_trinh_image_id,
        tinh_trang_rang_mieng,
        headerTitle,
        chinh_nha_id
    }: any = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        setRefreshing(false);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
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
                            <View style={styles.card}><ThuThuat thuthuat={thu_thuat_dieu_tri} /></View>
                            <View style={styles.card}><QuaTrinhImage anh={qua_trinh_image_id ? JSON.parse(qua_trinh_image_id as string) : null} /></View>
                            <View style={styles.card}><TinhTrang tinhtrang={tinh_trang_rang_mieng ? JSON.parse(tinh_trang_rang_mieng as string).noi_dung : null} /></View>
                            <View style={styles.card}><LoiDan chinh_nha_id={chinh_nha_id} flag={flag} setFlag={setFlag} /></View>
                            <View style={styles.card}><DichVuKhac chinh_nha_id={chinh_nha_id} /></View>
                            <View style={[styles.card, { marginBottom: 32 }]}><DanhGiaDichVu /></View>
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
        paddingTop: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ECECEC',
    },
});