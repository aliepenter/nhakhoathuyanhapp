import { View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Agenda, Calendar, LocaleConfig, DateData } from 'react-native-calendars';
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
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    today: "Hôm nay"
};

LocaleConfig.defaultLocale = 'vn';

// Hàm helper để lấy ngày hiện tại với múi giờ đúng
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

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
    const [today, setToday] = useState(getCurrentDate());
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
                monthFormat="MMMM yyyy"
                theme={{
                    monthTextColor: '#747474',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 20,
                    textDayHeaderFontWeight: '500',
                    textDayHeaderFontSize: 16,
                    textDayFontSize: 16,
                    textDayFontWeight: '400',
                    textSectionTitleColor: '#747474',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDayBackgroundColor: '#FB3F4A',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    arrowColor: '#FB3F4A',
                }}
                onDayPress={(day: any) => {
                    if (!flag) {
                        handleDayPress(day);
                    }
                }}
                onMonthChange={(date: DateData) => {
                    onMonthChange(date.month.toString(), date.year.toString());
                }}
                disableArrowLeft={disableArrowLeft}
                minDate={minDate ? today : undefined}
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