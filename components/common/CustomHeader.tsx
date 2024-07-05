// CustomHeader.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import images from '@/constants/images';

const CustomHeader = ({ title }: any) => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View className="h-[98px]">
            <ImageBackground source={images.bgHeaderPage} resizeMode='stretch' className='flex-row flex-1 items-end justify-center'>
                <Text className='text-[20px] font-psemibold text-white mb-[14px]'>{title}</Text>
                <TouchableOpacity className='absolute bottom-[5px] left-0' onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#f4511e',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        marginLeft: 10,
    },
    backButton: {
        padding: 10,
    },
});

export default CustomHeader;
