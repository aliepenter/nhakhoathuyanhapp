import { View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
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
    onMonthChange: (month: string, year: string) => void;
}
export default function CalendarComponent({ markedDates, onMonthChange }: CalendarComponentProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const handleDayPress = (day: any) => {
        setSelectedDate(day.dateString);
    };
    markedDates = {
        ...markedDates,
        [today]: { marked: true, dotColor: 'blue' },
    };
    return (
        <View>
            <Calendar
                hideExtraDays
                markedDates={markedDates}
                enableSwipeMonths={true}
                theme={{
                    monthTextColor: '#747474',
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 20,
                    textDayHeaderFontWeight: '500',
                    textDayHeaderFontSize: 16,

                }}
                onMonthChange={(month: {
                    year: string; month: string;
                }) => {
                    onMonthChange(month.month, month.year);
                }}
                showSixWeeks
                disableAllTouchEventsForDisabledDays
                renderArrow={(direction: any) => <CustomArrow direction={direction} />}
            />

        </View>
    )
}

const CustomArrow = ({ direction }: any) => {

    return (
        <Image className='w-[12px] h-[12px]' source={direction === 'left' ? icons.previousGreen : icons.nextGreen} />
    );
};