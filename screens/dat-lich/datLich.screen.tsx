import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StatusButton, { StatusButtonType } from '@/components/common/StatusButton';
import DichVuScreen from './dichVu.screen';
import NgayKhamScreen from './ngayKham.screen';
import Toast from 'react-native-toast-message';
import { runOnJS } from 'react-native-reanimated';
import ThanhCongScreen from './thanhCong.screen';
import { createLichHen, getLichHenByUserId } from '@/lib/apiCall';
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

const CHINH_NHA_SERVICE_ID = '1';

const isUpcomingAppointment = (item: LichHen) => {
    const appointmentDate = new Date(item.ngay_kham);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    return (
        item.change_request_status !== 'approved' &&
        appointmentDate >= today
    );
};

export default function DatLichScreen() {
    const { user } = useUser();
    const [selected, setSelected] = useState<StatusTab>(StatusTab.Tab1);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [hasUpcomingAppointment, setHasUpcomingAppointment] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedServiceName, setSelectedServiceName] = useState<string>('');

    useEffect(() => {
        const fetchUpcomingAppointments = async () => {
            if (!user?.id) return;

            try {
                const res = await getLichHenByUserId(user.id);
                const hasUpcoming = !!res?.data?.some((item: LichHen) => isUpcomingAppointment(item));
                setHasUpcomingAppointment(hasUpcoming);
            } catch (error) {
                console.error('Error fetching upcoming appointments:', error);
            }
        };

        fetchUpcomingAppointments();
    }, [user?.id]);

    useEffect(() => {
        if (hasUpcomingAppointment && selectedServiceId === CHINH_NHA_SERVICE_ID) {
            setSelectedServiceId(null);
            setSelectedServiceName('');
            setSelected(StatusTab.Tab1);
        }
    }, [hasUpcomingAppointment, selectedServiceId]);

    const handleServiceSelect = (id: string) => {
        if (id === CHINH_NHA_SERVICE_ID && hasUpcomingAppointment) {
            Toast.show({
                type: 'error',
                text1: 'Bạn đã có lịch hẹn sắp tới',
                text2: 'Nếu muốn đổi lịch, vui lòng vào mục Lịch hẹn.',
            });
            return;
        }

        setSelectedServiceId(id);
        const selectedService = services.find(service => service.id === id);
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

        if (selectedServiceId === CHINH_NHA_SERVICE_ID && hasUpcomingAppointment) {
            Toast.show({
                type: 'error',
                text1: 'Bạn đã có lịch hẹn sắp tới',
                text2: 'Vui lòng vào Lịch hẹn để yêu cầu đổi lịch.',
            });
            setSelected(StatusTab.Tab1);
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
        } catch {
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

    return (
        <View className='bg-white h-full'>
            <View className='px-[11px] mt-[16px]'>
                <StatusButton buttons={buttons} selectedTab={selected} />
                {
                    selected === StatusTab.Tab1
                        ?
                        (
                            <DichVuScreen
                                services={services}
                                selectedServiceId={selectedServiceId}
                                handleServiceSelect={handleServiceSelect}
                                setSelectedTab={setSelected}
                                disabledChinhNha={hasUpcomingAppointment}
                            />
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
