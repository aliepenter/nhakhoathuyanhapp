import { View, Text, Image, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { icons } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { checkDay } from '@/lib/commonFunctions';

type TimeTrackingProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    schedule: any;
    totalTime: number;
    lichHen: any;
}
export default function TimeTracking({ lichHen, schedule, totalTime, flag, setFlag }: TimeTrackingProps) {
    const onPress = () => {
        setFlag(true);
        Haptics.selectionAsync();
        router.push({
            pathname: "/(routes)/loving",
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }
    const onPressLichHen = () => {
        setFlag(true);
        Haptics.selectionAsync();
        router.push({
            pathname: "/(routes)/lich-hen",
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }
    return (
        <View className='flex-row flex-1 justify-between px-[11px] mt-[20px]'>
            <Pressable
                className={`w-[48%] h-[59px] `}
                disabled={flag}
                onPress={() => onPressLichHen()}
            >
                <LinearGradient
                    colors={['#1560A1', '#4FAA57']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className={`w-full h-full rounded-[10px] justify-center items-center`}
                >
                    <View className='flex-row items-center justify-center'>
                        <Image source={icons.calenderMonth} className='w-[16px] h-[16px] mr-[3px]' resizeMode='contain' />
                        <Text className='font-pbold text-[12px] text-white md:text-[16px]'>Lịch hẹn sắp tới</Text>
                    </View>
                    {schedule && schedule !== 0
                        ?
                        <Text className='font-pextrabold text-[12px] text-[#FBFF49] md:text-[16px]'>{schedule}</Text>
                        :
                        <Text className='font-pextrabold text-[12px] text-[#FBFF49] md:text-[16px]'>Không có lịch hẹn</Text>
                    }

                </LinearGradient>
                {
                    checkDay(lichHen)
                        ?
                        <View className='absolute left-[-5px] top-[-5px] w-[15px] h-[15px] rounded-full' style={styles.boxShadow}>
                            <Image source={icons.notificationHighlight} resizeMode='cover' className='w-full h-full' />
                        </View>
                        :
                        null
                }
            </Pressable>
            <Pressable
                className={`w-[48%] h-[59px] `}
                disabled={flag}
                onPress={() => onPress()}
            >
                <LinearGradient
                    colors={['#1560A1', '#4FAA57']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className={`w-full h-full rounded-[10px] justify-center items-center`}
                >
                    <View className='flex-row items-center justify-center'>
                        <Image source={icons.calenderDay} className='w-[16px] h-[16px] mr-[3px]' resizeMode='contain' />
                        <Text className='font-pbold text-[12px] text-white md:text-[16px]'>Thời gian niềng răng</Text>
                    </View>
                    {totalTime >= 0
                        ?
                        <Text className='font-pextrabold text-[12px] text-[#FBFF49] md:text-[16px]'>{totalTime} ngày</Text>
                        :
                        <View className="h-[23px] justify-center">
                            <ActivityIndicator color={'#00E5E5'} />
                        </View>
                    }
                </LinearGradient>
            </Pressable>
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
