import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { logout } from '@/lib/apiCall';
import CustomButton from '@/components/common/CustomButton';

const Profile = () => {

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Đăng xuất thất bại", "Xin vui lòng thử lại sau");
    }
  };
  return (
    <View className='mt-96'>
      <CustomButton
        title="Logout"
        handlePress={handleLogout}
        containerStyles="w-full mt-7"
      />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})