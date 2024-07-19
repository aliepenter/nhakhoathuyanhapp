import { View, Text, Pressable, Image, LayoutChangeEvent } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '@/constants';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export type TabButtonType = {
    title: string;
}

type TabButtonProps = {
    buttons: TabButtonType[];
    selectedTab: number;
    setSelectedTab: (index: number) => void
}
export default function TabButtons({ buttons, selectedTab, setSelectedTab }: TabButtonProps) {
    const [dimentions, setDimentions] = useState({ height: 63, width: 388 })
    const buttonWidth = dimentions.width / buttons.length;
    const tabPositionX = useSharedValue(0);
    const onTabbarLayout = (e: LayoutChangeEvent) => {
        setDimentions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    }
    const onTabPress = (index: number) => {
        tabPositionX.value = withTiming((buttonWidth) * index, {}, () => {
            runOnJS(handlePress)(index);
        })
    }
    const handlePress = (index: number) => {
        setSelectedTab(index);
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }]
        }
    })
    return (
        <LinearGradient
            colors={["#1560A1", "#4FAA57"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className='rounded-[6px] justify-center'
        >
            <Animated.View className='left-[5px] absolute bg-[#E54C4C] rounded-[6px] my-[5px]' style={[animatedStyle, { width: buttonWidth - 10, height: dimentions.height - 10 }]} />
            <View className='flex-row' onLayout={onTabbarLayout}>
                {
                    buttons.map((button, index) => {
                        return (
                            <Pressable className='flex-1 py-[20px]' key={index} onPress={() => onTabPress(index)}>
                                {
                                    selectedTab !== index
                                        ?
                                        <View className={`items-center justify-center flex-row`}>
                                            <Image className={`${index === 0 ? 'w-[25px] h-[18px]' : 'w-[17px] h-[18px]'} mr-1`} source={index === 0 ? icons.galleryWhite : icons.chinhNhaWhite} />
                                            <Text className={`text-[#FFFFFF] font-pbold`}>{button.title}</Text>
                                        </View>
                                        :
                                        <View className={`items-center justify-center flex-row`}>
                                            <Image className={`${index === 0 ? 'w-[25px] h-[18px]' : 'w-[17px] h-[18px]'} mr-1`} source={index === 0 ? icons.galleryWhite : icons.chinhNhaWhite} />
                                            <Text className={`text-[#FFFFFF] font-pbold`}>{button.title}</Text>
                                        </View>
                                }

                            </Pressable>
                        )
                    })
                }

            </View>
        </LinearGradient >
    )
}
