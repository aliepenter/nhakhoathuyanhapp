// CustomHeader.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import images from '@/constants/images';

const CustomHeader = ({ title, customStyle, disableBackButton }: any) => {
    const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
    };
    const truncatedTitle = title && title.length > 30 ? `${title.slice(0, 27)}...` : title;

    return (
        <View className={`${customStyle ? customStyle : ""} h-[98px]`}>
            <ImageBackground source={images.bgHeaderPage} resizeMode='stretch' className='flex-row flex-1 items-end justify-center'>
                <Text className='text-[20px] font-psemibold text-white mb-[14px]'>{truncatedTitle}</Text>
                {
                    disableBackButton
                        ?
                        null
                        :
                        <TouchableOpacity className='absolute bottom-[5px] left-0 p-[10px]' onPress={handleBack}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                }

            </ImageBackground>
        </View>
    );
};


export default CustomHeader;
