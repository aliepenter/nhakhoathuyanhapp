import { ScrollView, Text, View, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router'
import { useAuth } from '@/context/GlobalProvider'

const SignIn = () => {
  const [form, setForm] = useState({
    phone: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onLogin } = useAuth();
  const submit = async () => {
    if (!form.phone || !form.password) {
      Alert.alert('Đăng nhập thất bại', 'Xin vui lòng điền đầy đủ thông tin');
      return;
    }
    setIsSubmitting(true);
    try {
      await onLogin!(form.phone, form.password);
      router.push('/home');
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', 'Xin vui lòng kiểm tra lại thông tin');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full min-h-[83vh] justify-center px-4 my-6'>
          <Image source={images.logo} resizeMode='contain' className='w-full h-[200px]' />
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aura</Text>
          <FormField
            title="Số điện thoại"
            value={form.phone}
            handleChangeText={(e: any) => setForm({ ...form, phone: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Link href="/sign-up" className="text-lg text-gray-100 font-pregular">Don't have account?</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
