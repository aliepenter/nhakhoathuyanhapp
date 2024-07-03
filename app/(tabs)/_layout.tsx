import React from 'react';
import { Tabs } from 'expo-router';

import TabBar from '@/components/tabbar/TabBar';
import { View, Text } from 'react-native';

const TabsLayout = () => {


    return (
        <>
            <Tabs tabBar={props => <TabBar {...props} />}>
                <Tabs.Screen options={{ headerShown: false }} name="index" />
                <Tabs.Screen options={{ headerShown: false }} name="image-gallery/index" />
                <Tabs.Screen options={{ headerShown: false }} name="notification/index" />
                <Tabs.Screen options={{ headerShown: false }} name="profile/index" />
            </Tabs>
        </>
    );
};

export default TabsLayout;
