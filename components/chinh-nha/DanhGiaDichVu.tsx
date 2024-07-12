import { View, Text, TextInput, Image, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import FormField from '../common/FormField';
import CustomButton from '../common/CustomButton';
import { icons } from '@/constants';

export default function DanhGiaDichVu() {
    return (
        <View className='mt-[13px] pb-[20px]'>
            <Text className='text-[16px] font-pbold text-[#5EBA1B] text-center mb-[13px]'>
                Gửi tin nhắn tới phòng khám
            </Text>
            <Text className='text-[13px] text-[#757575] text-center mb-[13px]'>
                Nếu bạn có bất kì vấn đề gì liên quan đến ca chỉnh nha này cũng như nếu bạn có những đánh giá tới phòng khám, đừng ngần ngại gửi tin nhắn cho chúng tôi. Đó sẽ là động lực quý giá giúp  Nha khoa Thùy Anh cải thiện và phát triển hơn.
            </Text>
            <View className='bg-white rounded-2xl flex-row border-[1px] border-[#E2E2E2]'>
                <TextInput
                    className='flex-1 px-4 pt-2 pb-8 text-black font-semibold text-base'
                    placeholder="Nhập tại đây..."
                    placeholderTextColor="#7b7b8b"
                    multiline={true}
                    numberOfLines={6}
                />
                <TouchableOpacity className='absolute flex-row items-center bottom-2 right-2'>
                    <Image className='w-[21px] h-[15px] mr-[6px]' source={icons.gallery}/>
                    <Text className='text-[12px] text-[#A5A5A5]'>Ảnh đính kèm</Text>
                </TouchableOpacity>
            </View>
            <CustomButton
                title="Gửi đi"
                handlePress={() => { }}
                containerStyles="w-7/12 mt-[10px]"
                buttonStyle="rounded-xl  min-h-[62px]"
                colorFrom="#2594B8"
                colorTo="#226E9E"
                textStyles="text-white font-psemibold text-lg"
            />
        </View>
    );
}
