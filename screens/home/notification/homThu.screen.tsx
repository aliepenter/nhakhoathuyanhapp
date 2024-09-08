import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import { router } from 'expo-router';

export default function HomThuScreen() {
  const handleTruncate = (title: string) => {
    const truncatedTitle = title && title.length > 80 ? `${title.slice(0, 80)}...` : title;
    return truncatedTitle;
  }
  const onChatPress = () => {
    router.push({
      pathname: "/(routes)/chat",
      params: { headerTitle: 'Nha khoa Thùy Anh gửi bạn hợp đồng' },
    });
  }
  return (
    <View className='bg-white flex-1 px-[17px]'>
      <TouchableOpacity onPress={onChatPress} className='mt-[14px] rounded-[7px] bg-[#F5F5F5] p-[10px]' style={styles.boxShadow}>
        <View className='flex-row items-center justify-center flex-wrap opacity-60'>
          <View className='w-[80%] items-start'>
            <Text className='text-[#51B81A] font-pbold text-[14px]'>Nha khoa Thùy Anh gửi bạn hợp đồng</Text>
          </View>
          <View className='w-[20%] items-end'>
            <Text className='text-[#6C6C6C] font-pmedium text-[10px]'>1ph trước</Text>
          </View>
        </View>
        <View className='flex-row items-center justify-center flex-wrap opacity-60'>
          <View className='w-[85%]'>
            <Text className='font-pregular text-[12px]'>{handleTruncate('Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit. ')}</Text>
          </View>
          <View className='w-[15%] items-center'>
            <Image source={icons.circle} resizeMode='cover' className={` w-[13px] h-[13px] right-[-6.5px]`} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  }
});