import { StyleSheet, Text, View, Image, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import { Link, router } from 'expo-router'
import { useAuth } from '@/context/GlobalProvider'
import { useRoute } from "@react-navigation/native";
import { getProfile, login } from "@/lib/apiCall";
import { useGlobalContext } from '@/context/GlobalProviders'
import CustomButton from '@/components/CustomButton'

const PasswordScreen = () => {
    const [password, setPassword] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const route = useRoute();

    const { username }: any = route.params;

    const submit = async () => {
        if (!password) {
            Alert.alert('Đăng nhập thất bại', 'Xin vui lòng điền đầy đủ thông tin');
            return;
        }
        setIsSubmitting(true);
        try {
            await login!(username, password);
            router.push("/(tabs)");
        } catch (error) {
            Alert.alert('Đăng nhập thất bại', 'Xin vui lòng kiểm tra lại thông tin');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <ImageBackground source={images.bgPhoneInput} resizeMode='cover' className='flex-1'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className={`flex flex-1 ${Platform.OS === 'ios' ? 'justify-center' : 'justify-center'}`}
            >
                <View
                    className={`${Platform.OS === 'ios' ? 'my-8 mb-[60px]' : 'mt-16  mb-[30px]'}`}
                >
                    <Image source={images.logo} resizeMode='contain' className='w-full h-[104px]' />
                    <View
                        className={`items-center ${Platform.OS === 'ios' ? 'mt-[15px]' : 'mt-[10px]'}`}
                    >
                        <Text className='text-[24px] text-white font-pbold' style={styles.stroke}>Nha khoa Thùy Anh</Text>
                    </View>
                </View>
                <View>
                    <View
                        className={`items-center ${Platform.OS === 'ios' ? 'mb-[15px]' : 'mb-[10px]'}`}
                    >
                        <Text className='text-[24px] text-white font-pbold'>Xin chào!</Text>
                        <Text className='text-[14px] text-white font-pbold'>Vui lòng nhập số điện thoại của bạn để tiếp tục</Text>
                    </View>
                    <FormField
                        title="Số điện thoại"
                        keyboardType="numeric"
                        autoFocus={true}
                        value={password}
                        placeholder="Nhập số điện thoại của bạn tại đây"
                        handleChangeText={(e: any) => setPassword(e)}
                        otherStyles={`${Platform.OS === 'ios' ? 'mb-[15px]' : 'mb-[10px]'}`}
                    />
                    <View>
                        <CustomButton
                            title="Tiếp tục"
                            handlePress={submit}
                            containerStyles="w-11/12"
                            isLoading={isSubmitting}
                        />
                        <View className={`items-end w-[95%] ${Platform.OS === 'ios' ? 'mt-[15px]' : 'mt-[10px]'}`}>
                            <Link href="/sign-up" className="text-[14px] text-white font-pregular">Đăng nhập sau</Link>
                        </View>
                    </View>
                    <View className={`items-center w-[95%] ${Platform.OS === 'ios' ? 'mt-[25px]' : ''}`}>
                        <Link href="/sign-up" className="text-[12px] text-white font-pregular">Chính sách bảo mật</Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground >
    )
}

export default PasswordScreen
const styles = StyleSheet.create({
    stroke: {
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textShadowColor: '#2374A2',
    }
});