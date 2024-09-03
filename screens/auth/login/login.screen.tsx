import { StyleSheet, Text, View, Image, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, BackHandler } from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants'
import { Link, router } from 'expo-router'
import { trackPhoneNumber } from "@/lib/apiCall";
import { useFocusEffect } from '@react-navigation/native'
import FormField from '@/components/common/FormField';
import CustomButton from '@/components/common/CustomButton';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isIOS = Platform.OS === 'ios';
  const handleBackAction = () => {
    Alert.alert("Thoát khỏi ứng dụng", "Bạn muốn rời khỏi ứng dụng?", [
      {
        text: "Hủy bỏ",
        onPress: () => null,
        style: 'cancel'
      },
      {
        text: "Rời khỏi",
        onPress: () => BackHandler.exitApp()
      },
    ])
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackAction);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackAction);
      }
    }, [])
  )
  const submit = async () => {
    if (!phoneNumber) {
      Alert.alert('Đăng nhập thất bại', 'Xin vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!checkPhoneNumber(phoneNumber)) {
      Alert.alert('Đăng nhập thất bại', 'Số điện thoại chưa đúng');
      return;
    }
    setIsSubmitting(true);
    try {
      const phoneNumberStatus = await trackPhoneNumber!(phoneNumber);
      if (phoneNumberStatus) {
        router.push({
          pathname: "/(routes)/verify-password",
          params: { username: phoneNumber },
        });
      } else {
        router.push({
          pathname: "/(routes)/verify-sign-up",
          params: { username: phoneNumber },
        });
      }
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', 'Xin vui lòng kiểm tra kết nối của bạn');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkPhoneNumber = (phoneNumber: string) => {
    var vietnamesePhoneRegex = /^(?:\+84|0)(?:\d{9,10})$/;
    return vietnamesePhoneRegex.test(phoneNumber);
  }
  return (
    <ImageBackground source={images.bgPhoneInput} resizeMode='cover' className='flex-1'>
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        className={`flex flex-1 ${isIOS ? 'justify-center' : 'justify-center'}`}
      >
        <View
          className={`${isIOS ? 'my-8 mb-[60px]' : 'mt-16  mb-[30px]'}`}
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
            <Text className='text-[24px] text-white font-pbold'>Xin chào!</Text>
            <Text className='text-[14px] text-white font-pregular'>Vui lòng nhập số điện thoại của bạn để tiếp tục</Text>
          </View>
          <FormField
            title="Số điện thoại"
            keyboardType="number-pad"
            autoFocus={true}
            value={phoneNumber}
            placeholder="Nhập số điện thoại của bạn tại đây"
            handleChangeText={(e: any) => setPhoneNumber(e)}
            otherStyles={`${isIOS ? 'mb-[15px]' : 'mb-[10px]'}`}
          />
          <View>
            <CustomButton
              title="Tiếp tục"
              handlePress={submit}
              containerStyles="w-11/12"
              isLoading={isSubmitting}
              buttonStyle="rounded-xl min-h-[62px]"
              colorFrom="#2594B8"
              colorTo="#226E9E"
              textStyles="text-white font-psemibold text-lg" flag={false} iconStyle={undefined} icon={undefined} iconRight={undefined} />
            <View className={`items-end w-[95%] ${isIOS ? 'mt-[15px]' : 'mt-[10px]'}`}>
              <Link href="/sign-up" className="text-[14px] text-white font-pregular">Đăng nhập sau</Link>
            </View>
          </View>
          <View className={`items-center w-[95%] ${isIOS ? 'mt-[25px]' : ''}`}>
            <Link href="/sign-up" className="text-[12px] text-white font-pregular">Chính sách bảo mật</Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground >
  )
}

export default LoginScreen


const styles = StyleSheet.create({
  stroke: {
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: '#2374A2',
  }
});