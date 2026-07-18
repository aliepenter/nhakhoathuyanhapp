import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    StatusBar,
    RefreshControl,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useUser from '@/hooks/auth/useUser';
import * as Haptics from 'expo-haptics';
import { getReferralCount } from '@/lib/apiCall';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import icons from '@/constants/icons';
import images from '@/constants/images';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

const SHOW_REWARD_PROGRESS = false;

export default function GioiThieuScreen() {
    const { user } = useUser();
    const [referralCount, setReferralCount] = useState<number | null>(null);
    const [totalCommission, setTotalCommission] = useState<number | null>(null);
    const [loadingCount, setLoadingCount] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [sharing, setSharing] = useState(false);
    const viewShotRef = useRef<ViewShot>(null);

    const MILESTONES = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];
    const MAX = 30;
    const PROGRESS_TRACK_WIDTH = 1000;
    const PROGRESS_END_PADDING = 64;

    const referrerName = (user?.ho_va_ten ?? '').trim();
    const referrerNameWordCount = referrerName ? referrerName.split(/\s+/).length : 0;
    const referralNameFontSize = referrerNameWordCount >= 4 ? 14 : 22;
    const referralCode = user?.referral_code?.trim() || '---00000';

    const formatCommission = (amount: number): string => {
        if (amount >= 1000000) {
            const millions = amount / 1000000;
            return millions % 1 === 0 ? `${millions}tr` : `${millions.toFixed(1).replace('.', 'tr')}k`;
        }
        if (amount >= 1000) return `${Math.round(amount / 1000)}k`;
        return `${amount}đ`;
    };

    const fetchReferralCount = useCallback(async (showLoading = true) => {
        if (user) {
            if (showLoading) setLoadingCount(true);
            try {
                const res = await getReferralCount(user.id);
                if (res && res.data !== undefined) {
                    setReferralCount(res.data.count ?? 0);
                    setTotalCommission(res.data.totalCommission ?? 0);
                } else {
                    setReferralCount(0);
                    setTotalCommission(0);
                }
            } catch {
                setReferralCount(0);
                setTotalCommission(0);
            } finally {
                setLoadingCount(false);
                setRefreshing(false);
            }
        } else {
            setReferralCount(0);
            setTotalCommission(0);
            setLoadingCount(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchReferralCount();
    }, [fetchReferralCount]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchReferralCount(false);
    }, [fetchReferralCount]);

    const handleShare = async () => {
        Haptics.selectionAsync();
        setShowShareModal(true);
    };

    const handleShareImage = async () => {
        if (!viewShotRef.current?.capture) return;
        try {
            setSharing(true);
            const uri = await viewShotRef.current.capture();
            await Sharing.shareAsync(uri, {
                mimeType: 'image/jpeg',
                dialogTitle: 'Chia sẻ thẻ giới thiệu',
                UTI: 'share.jpeg',
            });
            Toast.show({
                type: 'success',
                text1: 'Chia sẻ thành công!',
                text2: 'Thẻ giới thiệu đã được chia sẻ.',
                visibilityTime: 3000,
            });
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Có lỗi xảy ra',
                text2: 'Không thể chia sẻ ảnh, vui lòng thử lại.',
                visibilityTime: 3000,
            });
        } finally {
            setSharing(false);
        }
    };

    const rules = [
        {
            step: '01',
            title: 'Điều kiện tham gia',
            content: 'Tất cả khách hàng đã hoặc đang điều trị chỉnh nha tại Nha Khoa Thùy Anh và đang sử dụng ứng dụng My Braces đều có thể tham gia.',
        },
        {
            step: '02',
            title: 'Cách nhận thưởng',
            content: 'Chia sẻ tên và mã giới thiệu của bạn cho người thân, bạn bè. Khi đến phòng khám, khách được giới thiệu cần phải đề cập đúng tên và mã giới thiệu của bạn.',
        },
        {
            step: '03',
            title: 'Mức thưởng',
            content: 'Bạn nhận được 5% giá trị hợp đồng chỉnh nha của người được giới thiệu. Tối đa không quá 1.000.000đ cho mỗi lượt giới thiệu thành công.',
        },
        {
            step: '04',
            title: 'Thời gian nhận thưởng',
            content: 'Thưởng được ghi nhận sau khi khách được giới thiệu thanh toán đủ đợt đầu và ký hợp đồng chính thức. Phòng khám sẽ liên hệ để trao thưởng trong vòng 7 ngày làm việc.',
        },
        {
            step: '05',
            title: 'Hình thức nhận thưởng',
            content: 'Tiền thưởng có thể được nhận bằng tiền mặt trực tiếp tại phòng khám hoặc trừ vào phí điều trị còn lại của bạn.',
        },
        {
            step: '06',
            title: 'Lưu ý',
            content: 'Không giới hạn số lần giới thiệu. Mỗi khách được giới thiệu chỉ được tính 1 lần cho 1 người giới thiệu. Phòng khám có quyền điều chỉnh chương trình mà không cần thông báo trước.',
        },
    ];

    return (
        <>
            <ScrollView
                className='flex-1 bg-[#F5F5F5]'
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1361AA']} />}
            >
                {/* Banner */}
                <View style={styles.banner} className='mx-4 mt-4 rounded-2xl p-5 flex-row items-center justify-between'>
                    <View className='flex-1'>
                        <Text className='text-white font-pbold text-[18px]'>Giới thiệu bạn bè</Text>
                        <Text className='text-white font-pbold text-[18px]'>Nhận quà hấp dẫn!</Text>
                        <Text className='text-white font-pregular text-[13px] mt-2 opacity-90'>
                            Nhận ngay 5% giá trị hợp đồng,{'\n'}tối đa <Text className='font-pbold'>1.000.000đ</Text> mỗi lượt
                        </Text>
                    </View>
                    <Image source={icons.giftGif} style={{ width: 90, height: 90 }} contentFit='contain' />
                </View>

                {/* Thống kê */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => { Haptics.selectionAsync(); router.push('/(routes)/gioi-thieu/chiTiet'); }}
                    className='mx-4 mt-4 bg-white rounded-2xl p-4 flex-row items-center justify-between'
                    style={styles.card}
                >
                    <View className='flex-1 items-center'>
                        <Text className='font-pregular text-[12px] text-[#888]'>Lượt giới thiệu</Text>
                        {loadingCount ? (
                            <ActivityIndicator size="small" color="#1361AA" className='mt-1' />
                        ) : (
                            <Text className='font-pbold text-[28px] text-[#1361AA] mt-1'>{referralCount ?? 0}</Text>
                        )}
                        <Text className='font-pregular text-[11px] text-[#aaa]'>lượt</Text>
                    </View>
                    <View style={styles.divider} />
                    <View className='flex-1 items-center'>
                        <Text className='font-pregular text-[12px] text-[#888]'>Hoa hồng tối đa</Text>
                        <Text className='font-pbold text-[22px] text-[#5EBA1B] mt-1'>5%</Text>
                        <Text className='font-pregular text-[11px] text-[#aaa]'>mỗi lượt</Text>
                    </View>
                    <View style={styles.divider} />
                    <View className='flex-1 items-center'>
                        <Text className='font-pregular text-[12px] text-[#888]'>Hoa hồng</Text>
                        {loadingCount ? (
                            <ActivityIndicator size="small" color="#5EBA1B" className='mt-1' />
                        ) : (
                            <Text className='font-pbold text-[22px] text-[#5EBA1B] mt-1'>
                                {totalCommission !== null ? formatCommission(totalCommission) : '0đ'}
                            </Text>
                        )}
                        <Text className='font-pregular text-[11px] text-[#aaa]'>đã nhận</Text>
                    </View>
                </TouchableOpacity>

                {/* Thanh tiến trình nhận quà */}
                {SHOW_REWARD_PROGRESS && <View className='mx-4 mt-4 bg-white rounded-2xl p-4' style={styles.card}>
                    <View className='flex-row items-center justify-between mb-3'>
                        <Text className='font-pbold text-[14px] text-[#333]'>Tiến trình nhận quà 🏆</Text>
                        <Text className='font-psemibold text-[12px] text-[#1361AA]'>{Math.min(referralCount ?? 0, MAX)}/{MAX}</Text>
                    </View>

                    {/* Bar + milestones - scroll ngang */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 8 }}
                    >
                        {/* Container cố định rộng để giãn các mốc */}
                        <View style={{ width: PROGRESS_TRACK_WIDTH + PROGRESS_END_PADDING, height: 95 }}>
                            {/* Reward placeholders phía trên mỗi mốc */}
                            {MILESTONES.map((m) => {
                                const left = (m / MAX) * PROGRESS_TRACK_WIDTH;
                                const reached = (referralCount ?? 0) >= m;
                                return (
                                    <View
                                        key={`reward-${m}`}
                                        style={[
                                            styles.rewardPlaceholder,
                                            reached ? styles.rewardPlaceholderReached : null,
                                            { left, marginLeft: -22 },
                                        ]}
                                    >
                                        {/* Đặt ảnh quà vào đây sau */}
                                    </View>
                                );
                            })}

                            {/* Track nền */}
                            <View style={[styles.progressTrack, { width: PROGRESS_TRACK_WIDTH }]}>
                                <View style={[
                                    styles.progressFill,
                                    { width: `${Math.min(((referralCount ?? 0) / MAX) * 100, 100)}%` }
                                ]} />
                            </View>

                            {/* Milestone dots */}
                            {MILESTONES.map((m) => {
                                const left = (m / MAX) * PROGRESS_TRACK_WIDTH;
                                const reached = (referralCount ?? 0) >= m;
                                return (
                                    <View
                                        key={m}
                                        style={[
                                            styles.milestoneDot,
                                            reached ? styles.milestoneDotReached : styles.milestoneDotPending,
                                            { left, marginLeft: -10 },
                                        ]}
                                    >
                                        {reached
                                            ? <Text style={{ fontSize: 10 }}>🎁</Text>
                                            : <Text style={styles.milestoneDotText}>{m}</Text>
                                        }
                                    </View>
                                );
                            })}

                            {/* Labels số dưới mỗi mốc */}
                            {MILESTONES.map((m) => {
                                const left = (m / MAX) * PROGRESS_TRACK_WIDTH;
                                const reached = (referralCount ?? 0) >= m;
                                return (
                                    <Text
                                        key={`label-${m}`}
                                        style={[
                                            styles.milestoneLabel,
                                            { left, marginLeft: -10, color: reached ? '#1361AA' : '#bbb' },
                                        ]}
                                    >
                                        {m}
                                    </Text>
                                );
                            })}

                            {/* Label 0 */}
                            <Text style={[styles.milestoneLabel, { left: 0, color: '#bbb' }]}>0</Text>
                        </View>
                    </ScrollView>

                    {/* Mốc tiếp theo */}
                    {(referralCount ?? 0) < MAX && (() => {
                        const next = MILESTONES.find(m => (referralCount ?? 0) < m);
                        const remaining = next ? next - (referralCount ?? 0) : 0;
                        return next ? (
                            <View style={styles.nextMilestoneBox} className='mt-3 rounded-xl px-3 py-2 flex-row items-center'>
                                <Text style={styles.nextMilestoneText}>
                                    Còn <Text style={styles.nextMilestoneHighlight}>{remaining} lượt</Text> nữa để đạt mốc <Text style={styles.nextMilestoneHighlight}>{next} 🎁</Text>
                                </Text>
                            </View>
                        ) : null;
                    })()}
                    {(referralCount ?? 0) >= MAX && (
                        <View style={[styles.nextMilestoneBox, { backgroundColor: '#E8F5E9' }]} className='mt-3 rounded-xl px-3 py-2'>
                            <Text style={[styles.nextMilestoneText, { color: '#2E7D32' }]}>🎉 Bạn đã đạt mốc tối đa! Phòng khám sẽ liên hệ trao thưởng.</Text>
                        </View>
                    )}
                </View>}

                {/* Mã giới thiệu */}
                <View className='mx-4 mt-4 bg-white rounded-2xl p-4' style={styles.card}>
                    <Text className='font-psemibold text-[14px] text-[#333] mb-3'>Mã giới thiệu của bạn</Text>
                    <View className='flex-row items-center justify-center bg-[#F0F7FF] rounded-xl px-4 py-3'>
                        <Text className='font-pbold text-[22px] text-[#1361AA] tracking-widest'>{referralCode}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleShare}
                        style={styles.shareButton}
                        className='mt-3 flex-row items-center justify-center rounded-xl py-3'
                    >
                        <Text className='text-white font-psemibold text-[14px] mr-2'>Chia sẻ ngay</Text>
                    </TouchableOpacity>
                </View>

                {/* Thể lệ */}
                <View className='mx-4 mt-4 mb-8'>
                    <Text className='font-pbold text-[16px] text-[#333] mb-3'>Thể lệ chương trình</Text>
                    {rules.map((rule, index) => (
                        <View key={index} className='bg-white rounded-2xl p-4 mb-3 flex-row' style={styles.card}>
                            <View style={styles.stepBadge} className='w-[36px] h-[36px] rounded-full justify-center items-center mr-3 mt-1 shrink-0'>
                                <Text className='text-white font-pbold text-[11px]'>{rule.step}</Text>
                            </View>
                            <View className='flex-1'>
                                <Text className='font-psemibold text-[14px] text-[#333] mb-1'>{rule.title}</Text>
                                <Text className='font-pregular text-[13px] text-[#666] leading-5'>{rule.content}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Modal chia sẻ thẻ */}
            <Modal
                visible={showShareModal}
                animationType='slide'
                transparent={false}
                onRequestClose={() => setShowShareModal(false)}
            >
                <StatusBar barStyle='light-content' backgroundColor='#0A1628' />
                <View style={styles.modalBg} className='flex-1 justify-center items-center px-4'>
                    {/* Thẻ capture */}
                    <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }} style={styles.cardCapture}>
                        <Image
                            source={images.referralscreen}
                            style={styles.referralTemplateImage}
                            contentFit='cover'
                        />

                        <View style={styles.referralNameOverlay}>
                            <Text style={[styles.referralNameText, { fontSize: referralNameFontSize }]} numberOfLines={2}>
                                {referrerName}
                            </Text>
                        </View>

                        <View style={styles.referralCodeOverlay}>
                            <Text style={styles.referralCodeText} numberOfLines={1}>
                                {referralCode}
                            </Text>
                        </View>
                    </ViewShot>

                    {/* Nút hành động */}
                    <View className='flex-row mt-5 w-full justify-center' style={{ gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => setShowShareModal(false)}
                            style={styles.btnClose}
                            className='flex-1 rounded-2xl py-4 items-center'
                        >
                            <Text style={styles.btnCloseText}>Đóng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleShareImage}
                            disabled={sharing}
                            style={styles.btnShare}
                            className='flex-1 rounded-2xl py-4 items-center'
                        >
                            {sharing
                                ? <ActivityIndicator color='#fff' />
                                : <Text style={styles.btnShareText}>Chia sẻ ảnh</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#1361AA',
    },
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    shareButton: {
        backgroundColor: '#5EBA1B',
    },
    stepBadge: {
        backgroundColor: '#1361AA',
    },
    divider: {
        width: 1,
        height: 50,
        backgroundColor: '#E8E8E8',
    },
    // Modal styles
    modalBg: {
        backgroundColor: '#0A1628',
    },
    cardCapture: {
        backgroundColor: '#fff',
        borderRadius: 24,
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: 3 / 4,
    },
    referralTemplateImage: {
        width: '100%',
        height: '100%',
    },
    referralNameOverlay: {
        position: 'absolute',
        top: '37%',
        left: '10%',
        right: '10%',
        alignItems: 'center',
    },
    referralNameText: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#1361AA',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        fontWeight: 'bold',
    },
    referralCodeOverlay: {
        position: 'absolute',
        top: '49%',
        left: '16%',
        right: '16%',
        alignItems: 'center',
    },
    referralCodeText: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#1361AA',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    // Progress bar styles
    progressTrack: {
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
        marginTop: 56,
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#1361AA',
        borderRadius: 6,
    },
    milestoneDot: {
        position: 'absolute',
        top: 52,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    milestoneDotReached: {
        backgroundColor: '#5EBA1B',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#5EBA1B',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
    },
    milestoneDotPending: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#BDBDBD',
    },
    milestoneDotText: {
        fontSize: 7,
        fontFamily: 'Poppins-Bold',
        color: '#999',
    },
    milestoneLabel: {
        position: 'absolute',
        top: 78,
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        width: 20,
    },
    rewardPlaceholder: {
        position: 'absolute',
        top: 0,
        width: 44,
        height: 44,
        borderRadius: 10,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#D0D0D0',
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rewardPlaceholderReached: {
        borderColor: '#5EBA1B',
        backgroundColor: '#F0FFF0',
    },
    progressLabelStart: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
        color: '#aaa',
    },
    progressLabelEnd: {
        fontSize: 11,
        fontFamily: 'Poppins-SemiBold',
        color: '#1361AA',
    },
    nextMilestoneBox: {
        backgroundColor: '#EAF4FF',
    },
    nextMilestoneText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#555',
    },
    nextMilestoneHighlight: {
        fontFamily: 'Poppins-Bold',
        color: '#1361AA',
    },
    btnClose: {
        backgroundColor: '#1E2A3A',
    },
    btnCloseText: {
        color: '#aaa',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
    },
    btnShare: {
        backgroundColor: '#5EBA1B',
    },
    btnShareText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
    },
})
