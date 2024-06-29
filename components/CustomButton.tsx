import { TouchableOpacity, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }: any) => {
    return (
        <View className={`justify-center flex items-center`}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                disabled={isLoading}
                className={`${containerStyles}`}
            >
                <LinearGradient
                    colors={['#2594B8', '#226E9E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className={`rounded-xl min-h-[62px] justify-center items-center ${isLoading ? 'opacity-50' : ''}`}
                >
                    <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
                        {title}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View >
    )
}

export default CustomButton