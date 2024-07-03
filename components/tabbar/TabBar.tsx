import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import icons from '@/constants/icons';

export default function TabBars({ state, descriptors, navigation }: any) {
    return (
        <View className={`h-[84px] absolute bottom-0 flex-row justify-between items-center w-full bg-[#F1F1F1] rounded-t-[20px] border-t-[#E2E2E2]`}>
            {state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                let iconName;
                let tabName;
                if (route.name === "index") {
                    iconName = icons.home;
                    tabName = "Trang chủ";
                } else if (route.name === "image-gallery/index") {
                    iconName = icons.gallery;
                    tabName = "Thư viện ảnh";
                } else if (route.name === "notification/index") {
                    iconName = icons.notification;
                    tabName = "Thông báo";
                } else if (route.name === "profile/index") {
                    iconName = icons.profile;
                    tabName = "Tài khoản";
                }

                return (
                    <TouchableOpacity
                        key={route.name}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        className={`${Platform.OS === 'ios' ? 'mb-6': 'mt-2 mb-2'} flex-1 items-center ${route.name === 'image-gallery/index' ? 'mr-10' : ''} ${route.name === 'notification/index' ? 'ml-10' : ''}`}

                    >
                        <Image source={iconName} resizeMode='contain' tintColor={isFocused ? '#5EBA1B' : '#8A8A8A'} className='w-[24px] h-[24px]' />
                        <Text className={`${isFocused ? 'text-[#5EBA1B] font-pbold' : 'text-[#8A8A8A] font-pregular'} mt-2 text-[10px]`}>{tabName}</Text>
                    </TouchableOpacity>

                );
            })}
            <TouchableOpacity className={`bottom-6 absolute left-[42%]`}>
                <Image source={icons.phoneCall} resizeMode='contain' className='w-[70px] h-[70px]'/>
            </TouchableOpacity>
        </View>
    );
}