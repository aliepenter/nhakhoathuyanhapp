import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import icons from '@/constants/icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { checkDay } from '@/lib/commonFunctions';

type Props = {
    flag: boolean;
    schedule: any;
    setFlag: (index: boolean) => void
}
const FunctionItem = ({ icon, title, path, flag, setFlag, notification }: any) => {
    const handlePress = (route: any) => {
        Haptics.selectionAsync();
        setFlag(true);
        router.push(route);
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    };
    return (
        <Pressable
            onPress={() => handlePress(path)}
            disabled={flag}
            className='items-center w-[25%] md:w-[20%] mb-[11px]'
        >
            <View style={styles.boxShadow} className={`justify-center items-center bg-[#FAFAFA] rounded-full w-[74px] h-[74px]`}>
                <Image source={icon} className='w-[40px] h-[40px]' contentFit='contain' transition={500} />
                {
                    notification
                        ?
                        <View className='absolute right-[6px] top-0 w-[15px] h-[15px] rounded-full' style={styles.boxShadow}>
                            <Image source={icons.notificationHighlight} contentFit='cover' className='w-full h-full' />
                        </View>
                        :
                        null
                }
            </View>

            <Text className='text-[12px] mt-[4px] font-psemibold md:text-[16px] md:mt-[6px]'>{title}</Text>
        </Pressable>
    )
}

export default function FunctionItemsList({ flag, setFlag, schedule }: Props) {

    return (
        <View className="flex-row flex-wrap">
            <FunctionItem setFlag={setFlag} flag={flag} notification={false} icon={icons.iconChinhNha} path="/(routes)/chinh-nha" title="Chỉnh nha" />
            <FunctionItem setFlag={setFlag} flag={flag} notification={false} icon={icons.iconThanhToan} path="/(routes)/payment" title="Thanh toán" />
            <FunctionItem setFlag={setFlag} flag={flag} notification={checkDay(schedule)} icon={icons.iconLichHen} path="/(routes)/lich-hen" title="Lịch hẹn" />
            <FunctionItem setFlag={setFlag} flag={flag} notification={false} icon={icons.iconLoiDan} path="/(routes)/loi-dan" title="Lời dặn" />
            <FunctionItem setFlag={setFlag} flag={flag} notification={false} icon={icons.iconChiNhanh} path="/(routes)/branches" title="Chi nhánh" />
            <FunctionItem setFlag={setFlag} flag={flag} notification={false} icon={icons.iconHopDong} path="/(routes)/hop-dong" title="Hợp đồng" />
            <FunctionItem setFlag={setFlag} flag={flag} notification={false} icon={icons.iconDatLich} path="/(routes)/dat-lich" title="Đặt lịch" />
            <FunctionItem setFlag={setFlag} flag={flag} notification={false} icon={icons.iconTinTuc} path="/(routes)/kien-thuc" title="Kiến thức" />
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
        elevation: 10
    }
});
