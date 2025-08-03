import { View, Text } from 'react-native'
import React, { useState } from 'react'
import StatusButton, { StatusButtonType } from '@/components/common/StatusButton';
import DichVuScreen from './dichVu.screen';
import { icons } from '@/constants';
import NgayKhamScreen from './ngayKham.screen';
import Toast from 'react-native-toast-message';
import { runOnJS } from 'react-native-reanimated';
import ThanhCongScreen from './thanhCong.screen';
import { createLichHen } from '@/lib/apiCall';
import useUser from '@/hooks/auth/useUser';

export enum StatusTab {
    Tab1,
    Tab2,
    Tab3
}

interface Service {
    id: string;
    name: string;
    icon: any | null;
    activeIcon: any | null;
}

const services: Service[] = [
    { id: '1', name: 'Khám chỉnh nha', icon: null, activeIcon: null },
    { id: '2', name: 'Khám tổng quát', icon: null, activeIcon: null },
    { id: '3', name: 'Tẩy trắng răng', icon: null, activeIcon: null },
    { id: '4', name: 'Lấy cao răng', icon: null, activeIcon: null },
    { id: '5', name: 'Nhổ răng', icon: null, activeIcon: null },
    { id: '6', name: 'Cắt chỉ', icon: null, activeIcon: null },
    { id: '7', name: 'Gắn lại khí cụ', icon: null, activeIcon: null },
    { id: '8', name: 'Chỉnh lại khí cụ', icon: null, activeIcon: null },
    { id: '9', name: 'Dịch vụ khác', icon: null, activeIcon: null },
];
export default function DatLichScreen() {
    const { user } = useUser();
    const [selected, setSelected] = useState<StatusTab>(StatusTab.Tab1);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedServiceName, setSelectedServiceName] = useState<string>('');
    const handleServiceSelect = (id: string) => {
        setSelectedServiceId(id);
        const selectedService = services.find(service => service.id == id);
        if (selectedService) {
            setSelectedServiceName(selectedService.name);
        }
    };

    const buttons: StatusButtonType[] = [
        {
            title: 'Chọn dịch vụ'
        },
        {
            title: 'Chọn ngày khám'
        },
        {
            title: 'Đặt lịch khám'
        }
    ]

    const onDatLichPress = (index: number) => {
        runOnJS(handleDatLich)(index);
    }

    const handleDatLich = async (index: number) => {
        // Validation đầy đủ
        if (!selectedServiceName || selectedServiceName === '') {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng chọn dịch vụ',
            });
            return;
        }
        
        if (!selectedDate || selectedDate === '') {
            Toast.show({
                type: 'error',
                text1: 'Vui lòng chọn ngày khám',
            });
            return;
        }

        // Kiểm tra ngày không được trong quá khứ
        const selectedDateObj = new Date(selectedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDateObj < today) {
            Toast.show({
                type: 'error',
                text1: 'Không thể chọn ngày trong quá khứ',
            });
            return;
        }

        setLoading(true);
        const lichHen: any = {
            ngay_kham: selectedDate,
            dich_vu: selectedServiceName,
            change_request_status: 'pending',
            change_request_date: null
        };
        
        try {
            await createLichHen(lichHen);
            setSelected(index); // Chuyển sang màn hình thành công
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Đã có lỗi xảy ra, xin thử lại sau',
            });
        } finally {
            setLoading(false);
        }
    };
    
    const onBackPress = () => {
        runOnJS(handleBack)();
    }

    const handleBack = () => {
        setSelected(0);
    };
    const showToast = () => {
        Toast.show({
            type: 'error',
            text1: 'Vui lòng chọn ngày khám',
        });
    }
    return (
        <View className='bg-white h-full'>
            <View className='px-[11px] mt-[16px]'>
                <StatusButton buttons={buttons} selectedTab={selected} />
                {
                    selected === StatusTab.Tab1
                        ?
                        (
                            <DichVuScreen services={services} selectedServiceId={selectedServiceId} handleServiceSelect={handleServiceSelect} setSelectedTab={setSelected} />
                        )
                        :
                        selected === StatusTab.Tab2
                            ?
                            (
                                <NgayKhamScreen selectedDate={selectedDate} setSelectedDate={setSelectedDate} onDatLichPress={onDatLichPress} onBackPress={onBackPress} loading={loading} />
                            )
                            :
                            (
                                <ThanhCongScreen serviceName={selectedServiceName} selectDate={selectedDate} />
                            )
                }
            </View>
        </View>
    )
}