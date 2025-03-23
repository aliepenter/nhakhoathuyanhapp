import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { images } from '@/constants';
import { Link, router } from 'expo-router';
import { useRoute } from "@react-navigation/native";
import { login } from "@/lib/apiCall";
import CustomButton from '@/components/common/CustomButton';

const OtpLoginScreen = () => {
    const [password, setPassword] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const route = useRoute();
    const { username }: any = route.params;

    const isIOS = Platform.OS === 'ios';
    const [code, setCode] = useState(new Array(6).fill(""));

    const inputs = useRef<any>([...Array(6)].map(() => React.createRef()));

    const handleInput = (text: any, index: any) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 3) {
            inputs.current[index + 1].current.focus();
        }

        if (text === "" && index > 0) {
            inputs.current[index - 1].current.focus();
        }
    };

    const handleLoginPassword = () => {
        router.push({
            pathname: "/(routes)/verify-password",
            params: { username: username },
        });
    }

    const handleSendOTPAgain = () => {
        router.push({
            pathname: "/(routes)/verify-password/otpLogin",
            params: { username: username },
        });
    }
    const submit = async () => {
        // if (!password) {
        //     Alert.alert('Đăng nhập thất bại', 'Xin vui lòng điền đầy đủ thông tin');
        //     return;
        // }
        // setIsSubmitting(true);
        // try {
        //     await login!(username, password);
        //     router.push("/(tabs)");
        // } catch (error) {
        //     Alert.alert('Đăng nhập thất bại', 'Xin vui lòng kiểm tra lại thông tin');
        // } finally {
        //     setIsSubmitting(false);
        // }
    };
    return (
        <ImageBackground source={images.bgPhoneInput} resizeMode='cover' className='flex-1'>
            <KeyboardAvoidingView
                behavior={isIOS ? 'padding' : 'height'}
                className={`flex flex-1 ${isIOS ? 'justify-center' : 'justify-center'}`}
            >
                <View
                    className={`items-center ${isIOS ? 'my-8 mb-[60px]' : 'mt-10 mb-[30px]'}`}
                >
                    <Image source={images.logonotext} resizeMode='contain' className='rounded-full w-[104px] h-[104px]' />
                    <View
                        className={`items-center ${isIOS ? 'mt-[15px]' : 'mt-[10px]'}`}
                    >
                        <Text className='text-[24px] text-white font-pbold' style={styles.stroke}>My Braces</Text>
                    </View>
                </View>
                <View>
                    <View
                        className={`items-center ${isIOS ? 'mb-[15px]' : 'mb-[10px]'}`}
                    >
                        <Text className='text-[24px] text-white font-pbold'>Xác nhận</Text>
                        <Text className='text-[14px] text-white font-pregular'>Mã OTP gồm 6 số đã được gửi đến số {username}</Text>
                    </View>
                    <View className='items-center'>
                        <View className='flex-row mb-[20px]'>
                            {code.map((_, index) => (
                                <TextInput
                                    key={index}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    onChangeText={(text) => handleInput(text, index)}
                                    value={code[index]}
                                    ref={inputs.current[index]}
                                    autoFocus={index === 0}
                                    className='text-white font-pbold w-[58px] h-[58px] border-[1px] border-gray-100 text-center mr-[5px] rounded-[10px] text-[20px]'
                                />
                            ))}
                        </View>
                    </View>
                    <View>
                        <CustomButton
                            title="Tiếp tục"
                            handlePress={submit}
                            containerStyles="w-11/12"
                            isLoading={isSubmitting}
                            buttonStyle="rounded-xl min-h-[62px]"
                            colorFrom="#2594B8"
                            colorTo="#226E9E"
                            textStyles="text-white font-psemibold text-lg" flag={false} iconStyle={undefined} icon={undefined} iconRight={undefined} notification={false} />
                        <View className={`items-end w-[95%] ${isIOS ? 'mt-[15px]' : 'mt-[10px]'}`}>
                            <TouchableOpacity
                                onPress={handleLoginPassword}
                                activeOpacity={0.7}
                            >
                                <Text className="text-[14px] text-white font-pregular">
                                    Đăng nhập bằng mật khẩu
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className={`items-center w-[95%] ${isIOS ? 'mt-[25px]' : 'mt-[15px]'}`}>
                            <TouchableOpacity
                                onPress={handleSendOTPAgain}
                                activeOpacity={0.7}
                            >
                                <Text className="text-[14px] text-white font-pregular">
                                    Chưa nhận được mã? Gửi lại mã
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
export default OtpLoginScreen;

const styles = StyleSheet.create({
    stroke: {
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textShadowColor: '#2374A2',
    },
});
