import { Text, View, ActivityIndicator, Image, Pressable } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

type CustomButtonProps = {
    flag: boolean;
    iconStyle: any;
    icon: any;
    title: any;
    handlePress: () => void;
    containerStyles: any;
    textStyles: any;
    isLoading: any;
    colorFrom: any;
    colorTo: any;
    iconRight: any;
    buttonStyle: any;
}
const CustomButton = ({ iconStyle, icon, title, handlePress, containerStyles, textStyles, isLoading, colorFrom, colorTo, buttonStyle, iconRight, flag }: CustomButtonProps) => {
    return (
        <View className={`justify-center flex items-center`}>
            <Pressable
                onPress={handlePress}
                disabled={isLoading ? true : flag}
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
                            <ButtonText iconStyle={iconStyle} textStyles={textStyles} title={title} isLoading={isLoading} icon={icon} iconRight={iconRight} />
                        </LinearGradient>
                        :
                        <View className={`${buttonStyle} justify-center items-center`}>
                            <ButtonText iconStyle={iconStyle} textStyles={textStyles} title={title} isLoading={isLoading} icon={icon} iconRight={iconRight} />
                        </View>
                }
            </Pressable>
        </View >
    )
}

export default CustomButton

const ButtonText = ({ textStyles, title, isLoading, icon, iconStyle, iconRight }: any) => {
    return <>
        {
            isLoading ?
                <ActivityIndicator color={'#00E5E5'} />
                :
                icon
                    ?
                    <View className='flex-row items-center justify-between'>
                        {
                            iconRight
                                ?
                                <>
                                    <Text className={`${textStyles}`}>
                                        {title}
                                    </Text>
                                    <Image
                                        source={icon}
                                        className={`${iconStyle}`}
                                    />
                                </>
                                :
                                <>
                                    <Image
                                        source={icon}
                                        className={`${iconStyle}`}
                                    />
                                    < Text className={`${textStyles}`}>
                                        {title}
                                    </Text >
                                </>
                        }
                    </View>
                    :
                    <Text className={`${textStyles}`}>
                        {title}
                    </Text>
        }
    </>
}