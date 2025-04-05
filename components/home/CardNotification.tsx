import { View, Text, Image, ActivityIndicator, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import React from 'react';
import * as Haptics from 'expo-haptics';
import CustomButton from '../common/CustomButton';

type CardProps = {
    flag: boolean;
    version: string;
    setFlag: (index: boolean) => void;

}
export default function CardNotification({ flag, setFlag, version }: CardProps) {
    const onPress = () => {
        setFlag(true);
        Haptics.selectionAsync();

        const url =
            Platform.OS === 'android'
                ? 'market://details?id=com.anonymous.nhakhoathuyanh' // Link cho Android
                : 'https://apps.apple.com/us/app/my-braces-ni%E1%BB%81ng-r%C4%83ng-th%C3%B9y-anh/id6743517132'; // Link cho iOS

        Linking.openURL(url)
            .catch(err => console.error('Failed to open app:', err));

        setTimeout(() => {
            setFlag(false);
        }, 1000);
    };
    return (
        <View className='flex-row justify-between mx-3 p-2 mt-[10px] bg-[#56bae1] rounded-[10px]'>
            <View className='w-[50%] justify-center'>
                <Text className='text-white font-bold'>Có phiên bản mới {version}!</Text>
            </View>
            <CustomButton
                title="Cập nhật ngay"
                handlePress={() => onPress()}
                icon={undefined}
                iconRight={false}
                containerStyles="w-[120px]"
                buttonStyle="rounded-full min-h-[40px]"
                colorFrom="#1560A1"
                colorTo="#4FAA57"
                textStyles="text-white font-pextrabold text-[12px]"
                iconStyle="" flag={flag} isLoading={undefined} notification={false} />
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
        shadowRadius: 11.7,
        elevation: 10
    }
});
