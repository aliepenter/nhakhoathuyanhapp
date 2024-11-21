import { View, Text, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import FormField from '@/components/common/FormField'
import CustomButton from '@/components/common/CustomButton'
import useUser from '@/hooks/auth/useUser';
import { changePassword } from '@/lib/apiCall';
import { router } from 'expo-router';

export default function ChangePasswordScreen() {
  const [password, setPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const isIOS = Platform.OS === 'ios';
  const handleRouter = (path: any) => {
    router.push({ pathname: path });

  }
  const submit = async () => {
    if (!password || !newPassword || !confirmPassword) {
      Alert.alert('Thất bại', 'Xin vui lòng điền đầy đủ thông tin');
      return;
    }
    setIsSubmitting(true);
    if (newPassword === confirmPassword) {
      const data: any = {
        password: password,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      };
      try {
        await changePassword(user?.id, data);
        Alert.alert('Thành công', 'Bạn đã thay đổi mật khẩu thành công!');
        handleRouter("(tabs)")
      } catch (error) {
        Alert.alert('Thất bại', 'Mật khẩu cũ chưa đúng!');
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 2000);
      }
    } else {
      Alert.alert('Thất bại', 'Mật khẩu mới không khớp!');
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }

  };
  return (
    <View className='h-full mt-2'>
      <View>
        <Text className='font-psemibold text-[14px] ml-4 mb-[5px]'>Mật khẩu cũ</Text>
        <FormField
          title="password"
          keyboardType="default"
          autoFocus={true}
          value={password}
          placeholder="******"
          handleChangeText={(e: any) => setPassword(e)}
          otherStyles={`${isIOS ? 'mb-[15px]' : ''}`}
        />
      </View>
      <View>
        <Text className='font-psemibold text-[14px] ml-4 mb-[5px]'>Mật khẩu mới</Text>
        <FormField
          title="password"
          keyboardType="default"
          autoFocus={false}
          value={newPassword}
          placeholder="******"
          handleChangeText={(e: any) => setNewPassword(e)}
          otherStyles={`${isIOS ? 'mb-[15px]' : ''}`}
        />
      </View>
      <View>
        <Text className='font-psemibold text-[14px] ml-4 mb-[5px]'>Nhập lại mật khẩu mới</Text>
        <FormField
          title="password"
          keyboardType="default"
          autoFocus={false}
          value={confirmPassword}
          placeholder="******"
          handleChangeText={(e: any) => setConfirmPassword(e)}
          otherStyles={`${isIOS ? 'mb-[15px]' : 'mb-[10px]'}`}
        />
      </View>
      <CustomButton
        title="Xác nhận"
        handlePress={submit}
        containerStyles="w-11/12"
        isLoading={isSubmitting}
        buttonStyle="rounded-xl min-h-[62px]"
        colorFrom="#2594B8"
        colorTo="#226E9E"
        textStyles="text-white font-psemibold text-lg" flag={false} iconStyle={undefined} icon={undefined} iconRight={undefined} />
    </View>
  )
}