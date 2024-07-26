import { View, Text } from 'react-native'
import React, { useState } from 'react'
import StatusButton, { StatusButtonType } from '@/components/common/StatusButton';
import DichVuScreen from './dichVu.screen';
import { icons } from '@/constants';
import NgayKhamScreen from './ngayKham.screen';
import Toast from 'react-native-toast-message';
import { runOnJS } from 'react-native-reanimated';
import ThanhCongScreen from './thanhCong.screen';
export enum StatusTab {
    Tab1,
    Tab2,
    Tab3
}
interface Service {
    id: string;
    name: string;
    icon: any;
    activeIcon: any;
}

const services: Service[] = [
    { id: '1', name: 'Niềng răng mắc cài', icon: icons.niengRang, activeIcon: icons.niengRangActive },
    { id: '2', name: 'Niềng răng Invisalign', icon: icons.niengRangInvi, activeIcon: icons.niengRangInviActive },
    { id: '3', name: 'Trồng răng Implant', icon: icons.implant, activeIcon: icons.implantActive },
    { id: '4', name: 'Trồng răng All on 4', icon: icons.ao4, activeIcon: icons.ao4Active },
    { id: '5', name: 'Răng sứ thẩm mỹ', icon: icons.tayTrang, activeIcon: icons.tayTrangActive },
    { id: '6', name: 'Dán sứ Veneer', icon: icons.veneer, activeIcon: icons.veneerActive },
    { id: '7', name: 'Nhổ răng khôn', icon: icons.nhoRangKhon, activeIcon: icons.nhoRangKhonActive },
    { id: '8', name: 'Chữa cười hở lợi', icon: icons.tiaLoi, activeIcon: icons.tiaLoiActive },
    { id: '9', name: 'Thái dương hàm', icon: icons.thaiDuongHam, activeIcon: icons.thaiDuongHamActive },
    { id: '10', name: 'Chữa tụt lợi', icon: icons.tutLoi, activeIcon: icons.tutLoiActive },
    { id: '11', name: 'Điều trị tủy', icon: icons.dieuTriTuy, activeIcon: icons.dieuTriTuyActive },
    { id: '12', name: 'Dịch vụ khác', icon: icons.dichVuKhac, activeIcon: icons.dichVuKhacActive },
];
export default function DatLichScreen() {
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

    const handleDatLich = (index: number) => {
        if (selectedDate != '') {
            setLoading(true);
            setTimeout(() => {
                setLoading(false)
                setSelected(index);
            }, 2000);
            // Xử lý gửi thông tin đặt lịch đi ở đây
        } else {
            showToast();

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