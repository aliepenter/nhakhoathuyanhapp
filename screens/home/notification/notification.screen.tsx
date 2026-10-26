import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import KhuyenMaiScreen from './khuyenMai.screen';
// import TroChuyenScreen from './troChuyen.screen';
// import useUnseenMessages from '@/hooks/useUnseenMessages';


// const FirstRoute = () => <TroChuyenScreen />;
const ThirdRoute = () => <KhuyenMaiScreen />;

const renderScene = SceneMap({
    // first: FirstRoute,
    // second: SecondRoute,
    third: ThirdRoute
});

export default function NotificationScreen() {
    // const { unseenCount } = useUnseenMessages();
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        // { key: 'first', title: 'Trò chuyện' },
        // { key: 'second', title: 'Hòm thư' },
        { key: 'third', title: 'Tin tức' }
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={() => null} // Tab bar ẩn vì chỉ còn 1 tab
        />
    );
}
