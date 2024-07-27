import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import HomThuScreen from './homThu.screen';
import LoiDanScreenTab from '../loi-dan/loiDanTab.screen';
import KhuyenMaiScreen from './khuyenMai.screen';
import TroChuyenScreen from './troChuyen.screen';

const FirstRoute = () => (
    <TroChuyenScreen />
);

const SecondRoute = () => (
    <HomThuScreen />

);

const ThirdRoute = () => (
    <KhuyenMaiScreen />

);

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute
});
export default function NotificationScreen() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Trò chuyện' },
        { key: 'second', title: 'Hòm thư' },
        { key: 'third', title: 'Khuyến mãi' }
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    );
}
const renderTabBar = (props: any) => (
    <TabBar
        {...props}
        getLabelText={({ route }) => route.title}
        indicatorStyle={{ backgroundColor: '#51B81A' }}
        style={{ backgroundColor: '#F2F2F2' }}
        activeColor="#51B81A"
        inactiveColor="#656565"
        scrollEnabled={true}
        bounces={true}
        renderLabel={({ route, focused, color }) => {
            return (
                <View className='flex-row gap-1 justify-center items-center'>
                    <Text style={{ color }} className='font-pbold'>
                        {route.title}
                    </Text>
                    <View className='w-[19px] h-[19px] bg-[#D7443A] rounded-full justify-center items-center'>
                        <Text className='font-pbold text-[10px] text-white'>2</Text>
                    </View>
                </View>
            )
        }
        }
    />
);