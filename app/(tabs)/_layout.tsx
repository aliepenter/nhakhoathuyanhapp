import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';

import TabBar from '@/components/tabbar/TabBar';
import { Alert, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { useFocusEffect } from '@react-navigation/native';
import CustomHeader from '@/components/common/CustomHeader';
import HeaderSection from '@/components/home/HeaderSection';
import useUser from '@/hooks/auth/useUser';
import { getAvatar } from '@/lib/apiCall';


const TabsLayout = () => {
    const { user } = useUser();
    const [flag, setFlag] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [disable, setDisable] = useState(false);
    const [refetch, setRefetch] = useState<number>();
    const [avatar, setAvatar] = useState<Settings>();
    useEffect(() => {
        if (user) {
            const id = user.avatar_id;
            fetchAvatar(id);
        }
    }, [user, refetch]);

    const fetchAvatar = async (userId: number) => {
        setDisable(true);
        try {
            const res = await getAvatar(userId);
            if (res) {
                setAvatar(res.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            setTimeout(() => setDisable(false), 5000);
        }
    };

    const handleBackAction = React.useCallback(() => {
        Alert.alert("Thoát khỏi ứng dụng", "Bạn muốn rời khỏi ứng dụng?", [
            {
                text: "Hủy bỏ",
                onPress: () => null,
                style: 'cancel'
            },
            {
                text: "Rời khỏi",
                onPress: () => BackHandler.exitApp()
            },
        ])
        return true;
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackAction);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackAction);
            }
        }, [])
    )
    return (
        <>
            <Tabs tabBar={props => <TabBar {...props} />}>
                <Tabs.Screen options={{
                    header: (props) => (
                        <HeaderSection user={user} setRefetch={setRefetch} showNotification={true} editAvatar={false} setFlag={setFlag} flag={flag} avatar={{
                            id: avatar?.id,
                            value: avatar?.value,
                        }} loading={loading} disable={disable} customBgColor="bg-white"/>
                    ),
                }} name="index" />
                <Tabs.Screen
                    name="image-gallery/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Thư viện nụ cười" disableBackButton={true} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="notification/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-[#F2F2F2]" title="Thông báo" disableBackButton={true} />
                        ),
                    }}
                />
                <Tabs.Screen options={{
                    header: (props) => (
                        <HeaderSection user={user} setRefetch={setRefetch} showNotification={false} editAvatar={true} setFlag={setFlag} flag={flag} avatar={{
                            id: avatar?.id,
                            value: avatar?.value,
                        }} loading={loading} disable={disable} customBgColor="bg-[#F2F1F6]" />
                    ),
                }} name="profile/index" />
            </Tabs>
            <StatusBar style='light' />
        </>
    );
};

export default TabsLayout;


