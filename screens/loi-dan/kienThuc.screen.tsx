import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import KienThucBaiVietScreen from './kienThucBaiViet.screen';
import KienThucVideoScreen from './kienThucVideo';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const FirstRoute = () => (
    <KienThucBaiVietScreen />
);

const SecondRoute = () => (
    <KienThucVideoScreen />
);


const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});
export default function KienThucScreen() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Bài viết' },
        { key: 'second', title: 'Video' },
    ]);
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
        />
    )
}

const renderTabBar = (props: any) => (
    <TabBar
        {...props}
        getLabelText={({ route }) => route.title}
        indicatorStyle={{ backgroundColor: '#51B81A' }}
        style={{ backgroundColor: '#F2F2F2' }}
        activeColor="#51B81A"
        inactiveColor="#656565"
        scrollEnabled={false}
        bounces={true}
        renderLabel={({ route, focused, color }) => {
            return (
                <View className='flex-row gap-1 justify-center items-center'>
                    <Text style={{ color }} className='font-pbold'>
                        {route.title}
                    </Text>
                </View>
            )
        }
        }
    />
);