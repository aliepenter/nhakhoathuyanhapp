import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import CalendarComponent from '@/components/common/CalendarComponent'
import CustomButton from '@/components/common/CustomButton'
import { icons } from '@/constants'
export default function LichHenScreen() {
    return (
        <View>
            <CalendarComponent />
            <View className='bg-white h-16 justify-center'>
                <CustomButton
                    title="Đổi lịch hẹn sắp tới"
                    handlePress={() => { }}
                    containerStyles=""
                    icon={icons.calenderMonthBlack}
                    buttonStyle="bg-[#EFEFEF] rounded-[6px] py-[5px] px-[19px] border-[#E1E1E1] border-[1px]"
                    textStyles="font-pregular text-[12px] md:text-[16px] text-[#616161]"
                    iconStyle="w-[16px] h-[16px] mr-[6px]"
                />
            </View>
            <ScrollView className='px-[11px] h-[39%]'>
                <View className='flex-row items-center h-20'>
                    <View className='items-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'>
                        <Text className='font-pregular text-[14px] text-[#111111]'>16</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>Th 6</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>2024</Text>
                        <Image source={icons.circle} resizeMode='cover' className='w-[13px] h-[13px] absolute right-[-6.5px] top-[50%]' />
                    </View>
                    <View className='w-[80%] items-end'>
                        <View className='bg-white w-[95%] h-[80%] rounded-[4px] border-l-[6px] border-[#51B81A]'>
                            <View className='justify-center items-end h-[30%] w-[98%]'>
                                <Text className='font-pregular text-[10px]'>16:28 SA</Text>
                            </View>
                            <View className='justify-start items-center h-[70%]'>
                                <Text className='font-pregular text-[14px]'>Chỉnh nha tại cơ sở TP. Thái Nguyên</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='flex-row items-center h-20'>
                    <View className='items-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'>
                        <Text className='font-pregular text-[14px] text-[#111111]'>16</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>Th 6</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>2024</Text>
                        <Image source={icons.circle} resizeMode='cover' className='w-[13px] h-[13px] absolute right-[-6.5px] top-[50%]' />
                    </View>
                    <View className='w-[80%] items-end'>
                        <View className='bg-white w-[95%] h-[80%] rounded-[4px] border-l-[6px] border-[#51B81A]'>
                            <View className='justify-center items-end h-[30%] w-[98%]'>
                                <Text className='font-pregular text-[10px]'>16:28 SA</Text>
                            </View>
                            <View className='justify-start items-center h-[70%]'>
                                <Text className='font-pregular text-[14px]'>Chỉnh nha tại cơ sở TP. Thái Nguyên</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='flex-row items-center h-20'>
                    <View className='items-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'>
                        <Text className='font-pregular text-[14px] text-[#111111]'>16</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>Th 6</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>2024</Text>
                        <Image source={icons.circle} resizeMode='cover' className='w-[13px] h-[13px] absolute right-[-6.5px] top-[50%]' />
                    </View>
                    <View className='w-[80%] items-end'>
                        <View className='bg-white w-[95%] h-[80%] rounded-[4px] border-l-[6px] border-[#51B81A]'>
                            <View className='justify-center items-end h-[30%] w-[98%]'>
                                <Text className='font-pregular text-[10px]'>16:28 SA</Text>
                            </View>
                            <View className='justify-start items-center h-[70%]'>
                                <Text className='font-pregular text-[14px]'>Chỉnh nha tại cơ sở TP. Thái Nguyên</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='flex-row items-center h-20'>
                    <View className='items-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'>
                        <Text className='font-pregular text-[14px] text-[#111111]'>16</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>Th 6</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>2024</Text>
                        <Image source={icons.circle} resizeMode='cover' className='w-[13px] h-[13px] absolute right-[-6.5px] top-[50%]' />
                    </View>
                    <View className='w-[80%] items-end'>
                        <View className='bg-white w-[95%] h-[80%] rounded-[4px] border-l-[6px] border-[#51B81A]'>
                            <View className='justify-center items-end h-[30%] w-[98%]'>
                                <Text className='font-pregular text-[10px]'>16:28 SA</Text>
                            </View>
                            <View className='justify-start items-center h-[70%]'>
                                <Text className='font-pregular text-[14px]'>Chỉnh nha tại cơ sở TP. Thái Nguyên</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className='flex-row items-center h-20'>
                    <View className='items-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'>
                        <Text className='font-pregular text-[14px] text-[#111111]'>16</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>Th 6</Text>
                        <Text className='font-pregular text-[12px] text-[#757575]'>2024</Text>
                        <Image source={icons.circle} resizeMode='cover' className='w-[13px] h-[13px] absolute right-[-6.5px] top-[50%]' />
                    </View>
                    <View className='w-[80%] items-end'>
                        <View className='bg-white w-[95%] h-[80%] rounded-[4px] border-l-[6px] border-[#51B81A]'>
                            <View className='justify-center items-end h-[30%] w-[98%]'>
                                <Text className='font-pregular text-[10px]'>16:28 SA</Text>
                            </View>
                            <View className='justify-start items-center h-[70%]'>
                                <Text className='font-pregular text-[14px]'>Chỉnh nha tại cơ sở TP. Thái Nguyên</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}