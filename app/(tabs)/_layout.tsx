import React from 'react';
import { Tabs } from 'expo-router';

import TabBar from '@/components/tabbar/TabBar';
import { Alert, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { useFocusEffect } from '@react-navigation/native';
import CustomHeader from '@/components/common/CustomHeader';


const TabsLayout = () => {
    const handleBackAction = () => {
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
    }

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
                <Tabs.Screen options={{ headerShown: false }} name="index" />
                <Tabs.Screen
                    name="image-gallery/index"
                    options={{
                        header: (props) => (
                            <CustomHeader {...props} customStyle="bg-white" title="Thư viện nụ cười"  disableBackButton={true}/>
                        ),
                    }}
                />
                <Tabs.Screen options={{ headerShown: false }} name="notification/index" />
                <Tabs.Screen options={{ headerShown: false }} name="profile/index" />
            </Tabs>
            <StatusBar style='light' />
        </>
    );
};

export default TabsLayout;
