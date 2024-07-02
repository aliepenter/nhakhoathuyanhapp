import { Text, View, Image } from 'react-native'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import icons from '@/constants/icons'

const TabIcon = ({ icon, color, name, focused }: any) => {
    return (
        <View className='items-center justify-center gap-2 mt-2 mb-2'>
            <Image source={icon} resizeMode='contain' tintColor={color} className='w-6 h-6' />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>{name}</Text>
        </View>
    )
}
const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={({ route }) => {
                    return {
                        tabBarIcon: ({ color, focused }) => {
                            let iconName;
                            let tabName;
                            if (route.name === "index") {
                                iconName = icons.home;
                                tabName = "Trang chủ";
                            } else if (route.name === "image-gallery/index") {
                                iconName = icons.booking;
                                tabName = "Thư viện ảnh";
                            } else if (route.name === "notification/index") {
                                iconName = icons.plus;
                                tabName = "Thông báo";
                            } else if (route.name === "profile/index") {
                                iconName = icons.profile;
                                tabName = "Tài khoản";
                            }
                            return (
                                <TabIcon icon={iconName} color={color} name={tabName} focused={focused}></TabIcon>
                            );
                        },
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarActiveTintColor: '#FFA001',
                        tabBarInactiveTintColor: '#CDCDE0',
                        tabBarStyle: {
                            backgroundColor: '#161622',
                            borderTopWidth: 1,
                            borderTopColor: '#232533',
                            height: 84,
                        }
                    };
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="image-gallery/index" />
                <Tabs.Screen name="notification/index" />
                <Tabs.Screen name="profile/index" />
            </Tabs>
            <StatusBar backgroundColor='#161622' style='light' />
        </>
    )
}

export default TabsLayout