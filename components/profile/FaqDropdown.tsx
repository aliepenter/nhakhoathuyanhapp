import { icons } from '@/constants';
import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, Animated } from 'react-native';

const FaqDropdown = ({ faq }: any) => {
    const [expanded, setExpanded] = useState(false);
    const [animation, setAnimation] = useState(new Animated.Value(0));

    const toggleDropdown = () => {
        setExpanded(!expanded);
        Animated.timing(animation, {
            toValue: expanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };


    const heightInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 85],
    });

    const animatedStyle: any = {
        height: heightInterpolate,
        overflow: 'hidden',
    };

    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    const animatedArrowStyle = {
        transform: [
            { rotate: rotateInterpolate }
        ],
    };

    return (
        <View className='bg-white mb-[13px] rounded-[7px]'>
            <TouchableOpacity onPress={toggleDropdown} className='flex-row justify-between items-center p-[15px]'>
                <View className='w-[90%]'>
                    <Text className='font-semibold text-[14px]'>{faq.question}</Text>
                </View>
                <View>
                    <Animated.View style={[animatedArrowStyle]}>
                        <Image source={icons.next} resizeMode='cover' className='w-[18px] h-[18px]' />
                    </Animated.View>
                </View>
            </TouchableOpacity>
            <Animated.View style={[animatedStyle]}>
                <Text className='font-pregular text-[12px] mt-[8px] mx-[15px]'>{faq.answer}</Text>
            </Animated.View>
        </View>
    );
};

export default FaqDropdown;
