import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
} from 'react-native';
import React, { useState } from 'react';
import { images } from '@/constants';
import FormField from '@/components/FormField';
import { Link, router } from 'expo-router';
import { useRoute } from "@react-navigation/native";
import { login } from "@/lib/apiCall";
import CustomButton from '@/components/CustomButton';

const PasswordScreen = () => {
    const [password, setPassword] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const route = useRoute();
    const { username }: any = route.params;

    const isIOS = Platform.OS === 'ios';

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
                behavior={isIOS ? 'padding' : 'height'}
                className={`flex flex-1 ${isIOS ? 'justify-center' : 'justify-center'}`}
            >
                <View
                    className={`${isIOS ? 'my-8 mb-[60px]' : 'mb-[30px]'}`}
                >
                    <Image source={images.logo} resizeMode='contain' className='w-full h-[104px]' />
                    <View
                        className={`items-center ${isIOS ? 'mt-[15px]' : 'mt-[10px]'}`}
                    >
                        <Text className='text-[24px] text-white font-pbold' style={styles.stroke}>Nha khoa Thùy Anh</Text>
                    </View>
                </View>
                <View>
                    <View
                        className={`items-center ${isIOS ? 'mb-[15px]' : 'mb-[10px]'}`}
                    >
                        <Text className='text-[24px] text-white font-pbold'>Mật khẩu</Text>
                        <Text className='text-[14px] text-white font-pbold'>Nhập mật khẩu cho tài khoản {username}</Text>
                    </View>
                    <FormField
                        title="password"
                        keyboardType="default"
                        autoFocus={true}
                        value={password}
                        placeholder="********"
                        handleChangeText={(e: any) => setPassword(e)}
                        otherStyles={`${isIOS ? 'mb-[15px]' : 'mb-[10px]'}`}
                    />
                    <View>
                        <CustomButton
                            title="Tiếp tục"
                            handlePress={submit}
                            containerStyles="w-11/12"
                            isLoading={isSubmitting}
                        />
                        <View className={`items-end w-[95%] ${isIOS ? 'mt-[15px]' : 'mt-[10px]'}`}>
                            <Link href="/sign-up" className="text-[14px] text-white font-pregular">Đăng nhập bằng mã OTP</Link>
                        </View>
                        
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

export default PasswordScreen;

const styles = StyleSheet.create({
    stroke: {
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textShadowColor: '#2374A2',
    }
});
