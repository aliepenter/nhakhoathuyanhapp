import { Image, Linking, Platform, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import icons from '@/constants/icons';
import { LinearGradient } from 'expo-linear-gradient';
import useUser from '@/hooks/auth/useUser';
import { SERVER_URL } from '@/utils/uri';

export default function TabBars({ state, descriptors, navigation }: any) {
    const { user } = useUser();
    const handlePress = useCallback(async () => {
        await Linking.openURL('tel:0869800318');
    }, []);
    return (
        <View className={`h-[84px] rounded-t-[20px] absolute bottom-0 bg-[#F1F1F1] opacity-[0.98]`}>
            <View className={`rounded-t-[20px] border-[#E2E2E2] border-t-[2px] flex-row justify-between items-center w-full`}>
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
                            className={`${Platform.OS === 'ios' ? 'mt-2' : 'mt-2 mb-2'} flex-1 items-center ${route.name === 'image-gallery/index' ? 'mr-10' : ''} ${route.name === 'notification/index' ? 'ml-10' : ''}`}

                        > 
                            {
                                route.name === "profile/index"
                                    ?
                                    user && user.anh_dai_dien ?
                                        <Image source={{ uri: `${SERVER_URL}${user.anh_dai_dien}` }} resizeMode='stretch' className='rounded-full w-[24px] h-[24px]' />
                                        :
                                        <Image source={iconName} resizeMode='contain' tintColor={isFocused ? '#5EBA1B' : '#8A8A8A'} className='w-[24px] h-[24px]' />

                                    :
                                    <Image source={iconName} resizeMode='contain' tintColor={isFocused ? '#5EBA1B' : '#8A8A8A'} className='w-[24px] h-[24px]' />

                            }
                            <Text className={`${isFocused ? 'text-[#5EBA1B] font-pbold' : 'text-[#8A8A8A] font-pregular'} mt-2 text-[10px]`}>{tabName}</Text>
                        </TouchableOpacity>

                    );
                })}
            </View>
            <TouchableOpacity className={`bottom-6 absolute left-[42%]`} onPress={handlePress}>
                <LinearGradient
                    colors={['#1361AA', '#5EBA1B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className={`w-[70px] h-[70px] bg-red-200 justify-center items-center rounded-full`}
                >
                    <Image source={icons.iconPhoneGif} resizeMode='contain' className='w-[45px] h-[45x]' />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}