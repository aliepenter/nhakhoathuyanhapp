import { View, Text, Alert, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { logout } from '@/lib/apiCall';
import useUser from '@/hooks/auth/useUser';
import HeaderSection from '@/components/home/HeaderSection';
import { icons } from '@/constants';
import CustomButton from '@/components/common/CustomButton';
import { router } from 'expo-router';

export default function ProfileScreen() {
    const { user } = useUser();

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            Alert.alert("Đăng xuất thất bại", "Xin vui lòng thử lại sau");
        }
    };
    const handleRouter = (path: any) => {
        router.push({ pathname: path });
    }
    return (
        <View className='bg-[#F2F1F6] h-full'>
            <HeaderSection user={user} />
            <ScrollView className='px-[20px] py-[13px]'>
                <View>
                    <Text className='text-[16px] font-psemibold'>Cài đặt</Text>
                    <View className='bg-white rounded-[10px] py-3  mt-[10px] mb-[16px]'>
                        <TouchableOpacity onPress={() => handleRouter("(routes)/profile/notificationSettings")} className='flex-row flex-nowrap'>
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
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRouter("(routes)/profile/changePassword")} className='flex-row flex-nowrap mt-3'>
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
                    </View>
                </View>
                <View>
                    <Text className='text-[16px] font-psemibold'>Thông tin</Text>
                    <View className='bg-white rounded-[10px] py-3  mt-[10px] mb-[16px]'>
                        <TouchableOpacity onPress={() => handleRouter("(routes)/profile/privacy")} className='flex-row flex-nowrap'>
                            <View className='w-[15%] justify-center items-center'>
                                <Image source={icons.dieuKhoan} resizeMode='cover' className='w-[14px] h-[17px]' />
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
                        <TouchableOpacity onPress={() => handleRouter("(routes)/profile/faq")} className='flex-row flex-nowrap mt-3'>
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
                        <TouchableOpacity onPress={() => handleRouter("(routes)/profile/aboutUs")} className='flex-row flex-nowrap mt-3'>
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
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRouter("(routes)/branches")} className='flex-row flex-nowrap mt-3'>
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
                        <View className='items-center flex-grow w-[33.33333%]'>
                            <Image source={icons.facebook} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Facebook
                            </Text>
                        </View>
                        <View className='items-center flex-grow w-[33.33333%]'>
                            <Image source={icons.zalo} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Zalo
                            </Text>
                        </View>
                        <View className='items-center flex-grow w-[33.33333%]'>
                            <Image source={icons.youtube} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Youtube
                            </Text>
                        </View>
                        <View className='items-center flex-grow w-[33.33333%] mt-[21px]'>
                            <Image source={icons.tiktok} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Tiktok
                            </Text>
                        </View>
                        <View className='items-center flex-grow w-[33.33333%] mt-[21px]'>
                            <Image source={icons.mail} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                E-mail
                            </Text>
                        </View>
                        <View className='items-center flex-grow w-[33.33333%] mt-[21px]'>
                            <Image source={icons.website} resizeMode='cover' className='w-[59px] h-[59px] mb-1' />
                            <Text className='text-[10px]'>
                                Website
                            </Text>
                        </View>
                    </View>
                </View>
                <CustomButton
                    title="ĐĂNG XUẤT"
                    handlePress={() => handleLogout() }
                    containerStyles="mt-[30px]"
                    icon={icons.dangXuat}
                    buttonStyle="rounded-full py-[10px] px-[50px] bg-[#E73E3F] border-[#D7D7D7] border-[1px]"
                    textStyles="font-psemibold text-[16px] md:text-[20px] text-white"
                    iconStyle="w-[18px] h-[18px] mr-[15px]"
                />
                <View className='h-[150px]'></View>
            </ScrollView>
        </View>
    )
}