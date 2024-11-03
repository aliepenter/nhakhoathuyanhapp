import { View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Agenda, Calendar, LocaleConfig } from 'react-native-calendars';
import { icons } from '@/constants';

LocaleConfig.locales['vn'] = {
    monthNames: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12'
    ],
    dayNames: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
    dayNamesShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    today: "Hôm nay"
};

LocaleConfig.defaultLocale = 'vn';
interface CalendarComponentProps {
    markedDates: any;
    lichHenSapToi: any;
    minDate: boolean;
    showSixWeeks: boolean;
    hideExtraDays: boolean;
    enableDayClick: boolean;
    disableArrowLeft: boolean;
    onMonthChange: (month: string, year: string) => void;
    handleDayPress: (date: string) => void;
    selectedDate: any;
    flag: boolean
}
export default function CalendarComponent({ flag, disableArrowLeft, enableDayClick, hideExtraDays, markedDates, lichHenSapToi, onMonthChange, minDate, showSixWeeks, selectedDate, handleDayPress }: CalendarComponentProps) {
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);

    const [currentMarkedDates, setCurrentMarkedDates] = useState<any>(markedDates);

    useEffect(() => {
        setCurrentMarkedDates({
            ...markedDates,
            ...lichHenSapToi,
            [today]: { marked: true, dotColor: 'blue' },
            [selectedDate]: { selected: true, selectedColor: '#FB3F4A' }
        });
    }, [selectedDate, markedDates, today]);

    return (
        <View>
            <Calendar
                hideExtraDays={hideExtraDays}
                markedDates={currentMarkedDates}
                enableSwipeMonths={true}
                theme={{
                    monthTextColor: '#747474',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 20,
                    textDayHeaderFontWeight: '500',
                    textDayHeaderFontSize: 16,

                }}
                onDayPress={(day: any) => {
                    if (!flag) {
                        handleDayPress(day);
                    }
                }}
                onMonthChange={(month: {
                    year: string; month: string;
                }) => {
                    onMonthChange(month.month, month.year);
                }}
                disableArrowLeft={disableArrowLeft}
                minDate={minDate ? today : null}
                showSixWeeks={showSixWeeks}
                disableAllTouchEventsForDisabledDays
                renderArrow={(direction: any) => <CustomArrow direction={direction} disableArrowLeft={disableArrowLeft} />}
            />

        </View>
    )
}

const CustomArrow = ({ direction, disableArrowLeft }: any) => {

    return (
        <Image className='w-[12px] h-[12px]' source={direction === 'left' ? disableArrowLeft ? null : icons.previousGreen : icons.nextGreen} />
    );
};