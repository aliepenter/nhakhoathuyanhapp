// CustomHeader.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import images from '@/constants/images';
import { icons } from '@/constants';

const CustomHeader = ({ title, customStyle, disableBackButton, downloadBtn }: any) => {
    const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
    };
    const truncatedTitle = title && title.length > 30 ? `${title.slice(0, 25)}...` : title;

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
                {
                    !downloadBtn
                        ?
                        null
                        :
                        <TouchableOpacity className='absolute bottom-[10px] right-3 p-[10px]' onPress={handleBack}>
                            <Image source={icons.download} className='w-[18px] h-[18px]' resizeMode='cover' />
                        </TouchableOpacity>
                }
            </ImageBackground>
        </View>
    );
};


export default CustomHeader;
