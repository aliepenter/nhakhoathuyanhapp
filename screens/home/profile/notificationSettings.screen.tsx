import { View, Text, Image, Switch } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'

export default function NotificationSettingsScreen() {
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const toggleSwitchNotification = () => setNotificationEnabled(previousState => !previousState);
    const [dealNotificationEnabled, setDealNotificationEnabled] = useState(true);
    const toggleSwitch = () => setDealNotificationEnabled(previousState => !previousState);
    return (
        <View className='h-full bg-[#F2F1F6] px-[19px] items-center mt-[56px]'>
            <Image resizeMode='cover' source={icons.notificationSettings} className='w-[188px] h-[188px]' />
            <Text className='text-center my-[10px] font-pregular text-[14px]'>Chúng tôi sẽ gửi đến bạn thông báo, tin tức và khuyến mãi mới nhất. Bật thông báo để không bỏ lỡ bất kì thông tin, deal hời nào từ chúng tôi.</Text>
            <View className='flex-row justify-center items-center bg-white rounded-[7px] px-[17px] py-[8px]'>
                <View className='w-[80%]'>
                    <Text className='text-[14px] font-pregular'>Nhận thông báo từ chúng tôi</Text>
                </View>
                <View className='w-[20%]'>
                    <Switch
                        trackColor={{ false: '#D9D9D9', true: '#75EB58' }}
                        thumbColor='#FCFCFC'
                        ios_backgroundColor="#D9D9D9"
                        onValueChange={toggleSwitchNotification}
                        value={notificationEnabled}
                    />
                </View>
            </View>
            <View className='flex-row justify-center items-center bg-white rounded-[7px] px-[17px] mt-[10px] py-[8px]'>
                <View className='w-[80%]'>
                    <Text className='text-[14px] font-pregular'>Nhận thông báo về các chương trình khuyến mãi</Text>
                </View>
                <View className='w-[20%]'>
                    <Switch
                        trackColor={{ false: '#D9D9D9', true: '#75EB58' }}
                        thumbColor='#FCFCFC'
                        ios_backgroundColor="#D9D9D9"
                        onValueChange={toggleSwitch}
                        value={dealNotificationEnabled}
                    />
                </View>
            </View>
        </View>
    )
}