import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import { logout } from '@/lib/apiCall';

const Profile = () => {

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Đăng xuất thất bại", "Xin vui lòng thử lại sau");
    }
  };
  return (
    <View>
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