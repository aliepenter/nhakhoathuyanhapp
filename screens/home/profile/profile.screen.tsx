import { View, Text, Alert, Image, ScrollView, TouchableOpacity, Pressable, Linking } from 'react-native'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { createDeleteRequest, getAllAccount, getAvatar, logout, updateMainStatus, deleteExpoToken } from '@/lib/apiCall';
import { icons } from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import { router } from 'expo-router';
import useUser from '@/hooks/auth/useUser';
import AccountSwitcher, { normalizeSwitchAccounts, SwitchAccount } from '@/components/profile/AccountSwitcher';
import { SERVER_URL } from '@/utils/uri';
import * as Updates from 'expo-updates';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function ProfileScreen() {
    const [flag, setFlag] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const { user, setRefetch } = useUser();
    const { expoPushToken } = usePushNotifications();
    const [account, setAccount] = useState<SwitchAccount[]>([]);
    const [switcherOpen, setSwitcherOpen] = useState(false);
    const [accountError, setAccountError] = useState('');
    const [switchingId, setSwitchingId] = useState<number | null>(null);
    const switchLock = useRef(false);
    const accountRequest = useRef(0);

    useEffect(() => {
        if (user) {
            const sdt = user.so_dien_thoai;
            fetchAccount(sdt);
        }
        return () => { accountRequest.current++; };
    }, [user]);

    const handleLogout = async () => {
        try {
            if (user && expoPushToken && expoPushToken.data) {
                try {
                    await deleteExpoToken(user.id, expoPushToken.data);
                } catch {
                    // Notification cleanup must not prevent local sign-out.
                }
            }
            await logout();
        } catch (error) {
            Alert.alert("Đăng xuất thất bại", "Xin vui lòng thử lại sau");
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Vô hiệu hóa tài khoản",
            "1. Sau khi chọn vô hiệu hóa, tài khoản sẽ được chuyển vào trạng thái lưu trữ trong vòng 15 ngày.\n" +
            "2. Trong 15 ngày tiếp theo từ ngày thao tác, nếu tiếp tục đăng nhập, vô hiệu hóa sẽ bị hủy bỏ.\n" +
            "3. Qua 15 ngày nếu không có thao tác đăng nhập, tài khoản của bạn sẽ bị vô hiệu hóa vĩnh viễn.",
            [
                {
                    text: "Hủy bỏ",
                    onPress: () => null,
                },
                {
                    text: "Vô hiệu hóa",
                    onPress: () => deleteAccount()
                },
            ]
        );
    };

    const deleteAccount = async () => {
        const account: any = {
            user_id: user?.id,
        };
        try {
            await createDeleteRequest(account).then(() => {
                Alert.alert("Vô hiệu hóa thành công", "Bạn sẽ được chuyển đến trang đăng nhập tài khoản!", [
                    {
                        text: "Ok",
                        onPress: () => handleLogout(),
                    }
                ]);
            });
        } catch (error) {
            Alert.alert("Vô hiệu hóa thất bại", "Xin vui lòng thử lại sau");
        }
    };

    const handleRouter = (path: any) => {
        setFlag(true);
        router.push({ pathname: path });
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }
    const openAccountSwitcher = () => {
        if (switchLock.current) return;
        setSwitcherOpen(true);
        if (user?.so_dien_thoai) void fetchAccount(user.so_dien_thoai);
    };
    const fetchAccount = async (sdt: string) => {
        const request = ++accountRequest.current;
        setLoading(true); setAccountError('');
        try {
            const result = await getAllAccount(sdt);
            if (!result) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            const accounts = normalizeSwitchAccounts(result.data);
            const resolved = await Promise.all(accounts.map(async item => {
                if (typeof item.avatar_id !== 'number' || item.avatar_id <= 0) return item;
                try { const avatar = await getAvatar(item.avatar_id); return { ...item, avatar_id: avatar?.data || null }; }
                catch { return { ...item, avatar_id: null }; }
            }));
            if (request === accountRequest.current) setAccount(resolved);
        } catch (error) {
            if (request === accountRequest.current) setAccountError('Không tải được danh sách tài khoản. Vui lòng thử lại.');
        } finally { if (request === accountRequest.current) setLoading(false); }
    };
    const handleSwitch = async (id: number) => {
        if (switchLock.current || Number(user?.id) === id || !account.some(item => item.id === id)) return;
        switchLock.current = true; setSwitchingId(id);
        try {
            const result = await updateMainStatus(id);
            if (!result) throw new Error('Phiên đăng nhập đã hết hạn.');
            setRefetch(previous => !previous);
            setSwitcherOpen(false);
            // Reload only after the server confirms the active account so all screens refresh.
            if (Updates.isEnabled) {
                try { await Updates.reloadAsync(); }
                catch { Alert.alert('Đã chuyển tài khoản', 'Vui lòng đóng và mở lại ứng dụng để tải đầy đủ thông tin tài khoản vừa chọn.'); }
            } else {
                router.replace('/');
            }
        } catch {
            Alert.alert('Chuyển tài khoản thất bại', 'Không thể chuyển tài khoản. Vui lòng thử lại.');
        } finally { switchLock.current = false; setSwitchingId(null); }
    };

    const handlePress = useCallback(async (url: any) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Không thể mở đường dẫn: ${url}`);
        }
    }, []);
    return (
        <View className='bg-[#F2F1F6] h-full'>
            <ScrollView className='px-[20px] py-[13px]'>
                <View>
                    <Text className='text-[16px] font-psemibold'>Cài đặt</Text>
                    <View className='bg-white rounded-[10px] py-3 mt-[10px] mb-[16px]'>
                        {/* <TouchableOpacity disabled={flag} onPress={() => handleRouter("(routes)/profile/notificationSettings")} className='flex-row flex-nowrap'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.caiDatThongBao} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px]'>
                                    Cài đặt thông báo
                                </Text>
                            </View>
                            <View className='w-[10%] justify-center items-center'>
                                <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity disabled={flag} onPress={() => handleRouter("(routes)/profile/changePassword")} className='flex-row flex-nowrap'>
                            {/* mt-3 */}
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.doiMatKhau} resizeMode='cover' className='w-[15px] h-[15px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px]'>
                                    Thay đổi mật khẩu
                                </Text>
                            </View>
                            <View className='w-[10%] justify-center items-center'>
                                <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={flag} onPress={() => handleDelete()} className='mt-3 flex-row flex-nowrap'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.del} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px] text-red-600 underline'>
                                    Vô hiệu hóa tài khoản
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {
                            account.length > 1 || !!accountError
                                ?
                                <TouchableOpacity disabled={flag} onPress={openAccountSwitcher} className='flex-row flex-nowrap mt-3'>
                                    <View className='w-[15%] justify-center items-center'>
                                        <Image source={icons.switchIcon} resizeMode='cover' className='w-[15px] h-[15px]' />
                                    </View>
                                    <View className='w-[75%]'>
                                        <Text className='text-[14px]'>
                                            Chuyển đổi tài khoản
                                        </Text>
                                    </View>
                                    <View className='w-[10%] justify-center items-center'>
                                        <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                                    </View>
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                </View>
                <View>
                    <Text className='text-[16px] font-psemibold'>Thông tin</Text>
                    <View className='bg-white rounded-[10px] py-3  mt-[10px] mb-[16px]'>
                        <TouchableOpacity disabled={flag} onPress={() => handleRouter("(routes)/profile/privacy")} className='flex-row flex-nowrap'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.veChungToi} resizeMode='cover' className='w-[14px] h-[17px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px]'>
                                    Điều kiện và điều khoản
                                </Text>
                            </View>
                            <View className='w-[10%] justify-center items-center'>
                                <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={flag} onPress={() => handleRouter("(routes)/profile/faq")} className='flex-row flex-nowrap mt-3'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.cauHoiThuongGap} resizeMode='cover' className='w-[14px] h-[14px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px]'>
                                    Câu hỏi thường gặp
                                </Text>
                            </View>
                            <View className='w-[10%] justify-center items-center'>
                                <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity disabled={flag} onPress={() => handleRouter("(routes)/profile/aboutUs")} className='flex-row flex-nowrap mt-3'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.veChungToi} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px]'>
                                    Về chúng tôi
                                </Text>
                            </View>
                            <View className='w-[10%] justify-center items-center'>
                                <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity disabled={flag} onPress={() => handleRouter("/(routes)/hop-dong")} className='flex-row flex-nowrap mt-3'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.dieuKhoan} resizeMode='cover' className='w-[14px] h-[17px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px]'>
                                    Hồ sơ khách hàng
                                </Text>
                            </View>
                            <View className='w-[10%] justify-center items-center'>
                                <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={flag} onPress={() => handleRouter("(routes)/branches")} className='flex-row flex-nowrap mt-3'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.lienHe} resizeMode='cover' className='w-[22px] h-[22px]' />
                            </View>
                            <View className='w-[75%]'>
                                <Text className='text-[14px]'>
                                    Chi nhánh
                                </Text>
                            </View>
                            <View className='w-[10%] justify-center items-center'>
                                <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text className='text-[16px] font-psemibold'>Liên hệ với chúng tôi</Text>
                    <View className='bg-white rounded-[10px] py-3 mt-[10px] mb-[16px] flex-row flex-wrap'>
                        <Pressable
                            onPress={() => handlePress('https://www.facebook.com/@NKTA.official')}
                            disabled={flag}
                            className='items-center flex-grow w-[33.33333%]'
                        >
                            <Image source={icons.facebook} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Facebook
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handlePress('https://www.youtube.com/@nhakhoa.thuyanh/shorts')}
                            disabled={flag}
                            className='items-center flex-grow w-[33.33333%]'
                        >
                            <Image source={icons.short} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Short
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handlePress('https://www.youtube.com/@nhakhoathuyanh')}
                            disabled={flag}
                            className='items-center flex-grow w-[33.33333%]'
                        >
                            <Image source={icons.youtube} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Youtube
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handlePress('https://www.tiktok.com/@nhakhoathuyanh662')}
                            disabled={flag}
                            className='items-center flex-grow w-[33.33333%] mt-[21px]'
                        >
                            <Image source={icons.tiktok} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Tiktok
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handlePress('https://zalo.me/2568030874056794574')}
                            disabled={flag}
                            className='items-center flex-grow w-[33.33333%] mt-[21px]'
                        >
                            <Image source={icons.zalo} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Zalo
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handlePress('https://nhakhoathuyanh.com/')}
                            disabled={flag}
                            className='items-center flex-grow w-[33.33333%] mt-[21px]'
                        >
                            <Image source={icons.website} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Website
                            </Text>
                        </Pressable>

                    </View>
                </View>
                <CustomButton
                    title="ĐĂNG XUẤT"
                    handlePress={() => handleLogout()}
                    containerStyles="mt-[30px]"
                    icon={icons.dangXuat}
                    buttonStyle="rounded-full py-[10px] px-[50px] bg-[#E73E3F] border-[#D7D7D7] border-[1px]"
                    textStyles="font-psemibold text-[16px] md:text-[20px] text-white"
                    iconStyle="w-[18px] h-[18px] mr-[15px]" flag={false} isLoading={undefined} colorFrom={undefined} colorTo={undefined} iconRight={undefined} notification={false} />
                <View className='h-[150px]'></View>
            </ScrollView>
            <AccountSwitcher visible={switcherOpen} accounts={account} currentId={user?.id} serverUrl={SERVER_URL}
                loading={loading} error={accountError} switchingId={switchingId}
                onClose={() => { if (!switchLock.current) setSwitcherOpen(false); }}
                onRetry={() => { if (user?.so_dien_thoai) void fetchAccount(user.so_dien_thoai); }} onSelect={handleSwitch} />
        </View>
    )
}
