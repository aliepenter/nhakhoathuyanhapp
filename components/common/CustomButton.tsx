import { TouchableOpacity, Text, View, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({ iconStyle, icon, title, handlePress, containerStyles, textStyles, isLoading, colorFrom, colorTo, buttonStyle }: any) => {
    return (
        <View className={`justify-center flex items-center`}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                disabled={isLoading}
                className={`${containerStyles}`}
            >
                {
                    colorFrom && colorTo
                        ?
                        <LinearGradient
                            colors={[colorFrom, colorTo]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className={`${buttonStyle} justify-center items-center`}
                        >
                            <ButtonText iconStyle={iconStyle} textStyles={textStyles} title={title} isLoading={isLoading} icon={icon} />
                        </LinearGradient>
                        :
                        <View className={`${buttonStyle} justify-center items-center`}>
                            <ButtonText iconStyle={iconStyle} textStyles={textStyles} title={title} isLoading={isLoading} icon={icon} />
                        </View>
                }
            </TouchableOpacity>
        </View >
    )
}

export default CustomButton

const ButtonText = ({ textStyles, title, isLoading, icon, iconStyle }: any) => {
    return <>
        {
            isLoading ?
                <ActivityIndicator />
                :
                icon ?
                    <View className='flex-row items-center justify-between'>
                        <Image
                            source={icon}
                            className={`${iconStyle}`}
                        />
                        < Text className={`${textStyles}`}>
                            {title}
                        </Text >
                    </View>
                    :
                    < Text className={`${textStyles}`}>
                        {title}
                    </Text >
        }
    </>
}