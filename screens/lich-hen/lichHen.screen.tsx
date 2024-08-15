import { View, Text, ScrollView, Image, ActivityIndicator, Pressable, Button, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CalendarComponent from '@/components/common/CalendarComponent'
import CustomButton from '@/components/common/CustomButton'
import { icons } from '@/constants'
import useUser from '@/hooks/auth/useUser'
import { getChinhNha } from '@/lib/apiCall'
import { formatDate, formatISODateToAMPM } from '@/lib/commonFunctions'
import { router } from 'expo-router'
const ITEM_HEIGHT = 80;
interface MarkedDates {
    [date: string]: {
        selected: boolean;
        selectedColor: string;
    };
}
export default function LichHenScreen() {
    const { user } = useUser();
    const [flag, setFlag] = useState<boolean>(false);
    const [chinhNha, setChinhNha] = useState<Array<ChinhNha>>();
    const [loading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const today = new Date().toISOString().split('T')[0];
    const [year, month] = today.split('-');
    const [calendarMonth, setCalendarMonth] = useState<string>(month);
    const [calendarYear, setCalendarYear] = useState<string>(year);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollToItem = (index: number) => {
        const positionY = index * ITEM_HEIGHT;

        scrollViewRef.current?.scrollTo({ y: positionY, animated: true });
    };
    useEffect(() => {
        if (user) {
            const userId = user.id;
            fetchChinhNha(userId);
        }
    }, [user]);

    const fetchChinhNha = async (userId: number) => {
        try {
            const chinhNhaData = await getChinhNha(userId);
            setTimeout(() => {
                if (chinhNhaData) {
                    setChinhNha(chinhNhaData.data);
                    if (chinhNhaData.data.length !== 0) {
                        const dates: MarkedDates = {};
                        chinhNhaData.data.forEach((item: { ngay_chinh_nha: any }) => {
                            const formattedDate = formatDate(item.ngay_chinh_nha, 'isoDate');
                            if (formattedDate) {
                                dates[formattedDate] = { selected: true, selectedColor: '#51B81A' };
                            }
                        });
                        setMarkedDates(dates);
                    }
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            }, 1500);

        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 500);
        }
    };
    const handlePress = (item: ChinhNha) => {
        const title = `Chỉnh nha ngày ${formatDate(item.ngay_chinh_nha, "minimize")}`;
        setFlag(true);
        router.push({
            pathname: "(routes)/chinh-nha/chinhNhaDetail",
            params: {
                headerTitle: title,
                thu_thuat_dieu_tri: item.thu_thuat_dieu_tri ? item.thu_thuat_dieu_tri : null,
                qua_trinh_image_id: item.qua_trinh_image_id ? JSON.stringify(item.qua_trinh_image_id) : null,
                tinh_trang_rang_mieng: item.loi_dan_id ? JSON.stringify(item.loi_dan_id) : null,
                chinh_nha_id: item.id
            },
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }
    const checkActive = (ngay_chinh_nha: any, index: any) => {
        if (calendarMonth == formatDate(ngay_chinh_nha, "month") && calendarYear == formatDate(ngay_chinh_nha, "year")) {
            scrollToItem(index);
            return true;
        } else {
            return false;
        }

    }
    const handleMonthChange = (month: string, year: string) => {
        setCalendarMonth(month);
        setCalendarYear(year);
    };
    const onChangeDay = () => {
        setFlag(true);
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }
    return (
        <View>
            <View className={`${Platform.OS === 'ios' ? 'h-[54%]' : 'h-[57%]'} bg-white`}>
                <View className='h-[88%] bg-white'>
                    {
                        !loading
                            ?
                            <CalendarComponent selectedDate={null} setSelectedDate={() => { }} disableArrowLeft={false} enableDayClick={false} hideExtraDays={true} minDate={false} showSixWeeks={true} markedDates={markedDates} onMonthChange={handleMonthChange} />
                            :
                            <View className="h-96 justify-center">
                                <ActivityIndicator />
                            </View>
                    }
                </View>
                <View className='bg-white justify-center h-[12%]'>
                    {
                        !loading
                            ?
                            <CustomButton
                                flag={flag}
                                title="Đổi lịch hẹn sắp tới"
                                handlePress={onChangeDay}
                                containerStyles=""
                                icon={icons.calenderMonthBlack}
                                buttonStyle="bg-[#EFEFEF] rounded-[6px] py-[5px] px-[19px] border-[#E1E1E1] border-[1px]"
                                textStyles="font-pregular text-[12px] md:text-[16px] text-[#616161]"
                                iconStyle="w-[16px] h-[16px] mr-[6px]"
                                isLoading={false}
                                colorFrom={null}
                                colorTo={null}
                                iconRight={null} />
                            :
                            null
                    }

                </View>
            </View>
            <ScrollView ref={scrollViewRef} className={`${Platform.OS === 'ios' ? 'h-[46%]' : 'h-[43%]'} px-[11px]`}>
                {!loading
                    ?
                    chinhNha && chinhNha.length != 0
                        ?
                        chinhNha.map((item: ChinhNha, index: number) => (
                            index !== chinhNha.length
                                ?
                                <Pressable
                                    key={index}
                                    className={`flex-row items-center h-20`}
                                    onPress={() => handlePress(item)}
                                    disabled={flag}
                                >
                                    <View className='items-center justify-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'>
                                        <Text className='font-pregular text-[14px] text-[#111111]'>{formatDate(item.ngay_chinh_nha, "day")}</Text>
                                        <Text className='font-pregular text-[12px] text-[#757575]'>Th {formatDate(item.ngay_chinh_nha, "month")}</Text>
                                        <Text className='font-pregular text-[12px] text-[#757575]'>{formatDate(item.ngay_chinh_nha, "year")}</Text>
                                        <Image source={
                                            checkActive(item.ngay_chinh_nha, index)
                                                ? icons.circleActive
                                                : icons.circle
                                        } resizeMode='cover' className={`${Platform.OS === 'ios' ? 'top-[56%]' : 'top-[60%]'} w-[13px] h-[13px] absolute right-[-6.5px]`} />
                                    </View>
                                    <View className={`${Platform.OS === 'ios' ? 'h-[90%]' : ''} w-[80%] items-end justify-center`}>
                                        <View className='bg-white w-[95%] h-[80%] rounded-[4px] border-l-[6px] border-[#51B81A]'>
                                            <View className='justify-center items-end h-[35%] w-[98%]'>
                                                <Text className='font-pregular text-[10px]'>{formatISODateToAMPM(item.ngay_chinh_nha)}</Text>
                                            </View>
                                            <View className='justify-start ml-2 h-[65%]'>
                                                <Text className='font-pregular text-[14px]'>Chỉnh nha tại {item.branch_id.ten_chi_nhanh}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                                :
                                <View className='h-4' key={index}>
                                    <View className='items-center h-full py-[10px] w-[20%] border-r-[1px] border-[#D8D8D8]'></View>
                                </View>
                        ))
                        :
                        <View className='justify-center items-center h-96'>
                            <Text>Không có dữ liệu chỉnh nha</Text>
                        </View>
                    :
                    <View className="h-64 justify-center">
                        <ActivityIndicator />
                    </View>
                }
            </ScrollView>
        </View>
    )
}