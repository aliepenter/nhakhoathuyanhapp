import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import icons from '@/constants/icons';
import { router } from 'expo-router';

const FunctionItem = ({ icon, title, path }: any) => {
    const handlePress = (route: any) => {
        router.push(route);
    }
    return (
        <TouchableOpacity
            onPress={() => handlePress(path)}
            activeOpacity={1}
            className='items-center'
        >
            <View style={styles.boxShadow} className={`justify-center items-center bg-[#FAFAFA] rounded-full w-[74px] h-[74px]`}>
                <Image source={icon} className='w-[40px] h-[40px]' resizeMode='contain' />
            </View>

            <Text className='text-[12px] mt-[4px] font-psemibold'>{title}</Text>
        </TouchableOpacity>
    )
}

export default function FunctionItemsList() {
    return (
        <View className="h-[200px] flex-col justify-between pl-[11px] pr-[11px]">
            <View className="flex-row justify-between">
                <FunctionItem icon={icons.iconChinhNha} title="Chỉnh nha" />
                <FunctionItem icon={icons.iconDatLich} title="Đặt lịch" />
                <FunctionItem icon={icons.iconLichHen} title="Lịch hẹn" />
                <FunctionItem icon={icons.iconThanhToan} title="Thanh toán" />
            </View>
            <View className="flex-row justify-between">
                <FunctionItem icon={icons.iconChiNhanh} path="/(routes)/branches" title="Chi nhánh" />
                <FunctionItem icon={icons.iconTinTuc} title="Tin tức" />
                <FunctionItem icon={icons.iconHopDong} title="Hợp đồng" />
                <FunctionItem icon={icons.iconLoiDan} title="Lời dặn" />
            </View>
        </View>
    );
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
        elevation: 20
    }
});
