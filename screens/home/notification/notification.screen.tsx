import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, PressableAndroidRippleConfig, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { TabView, SceneMap, TabBar, NavigationState, Route, SceneRendererProps, TabBarIndicatorProps, TabBarItemProps } from 'react-native-tab-view';
import HomThuScreen from './homThu.screen';
import KhuyenMaiScreen from './khuyenMai.screen';
import TroChuyenScreen from './troChuyen.screen';
import useUnseenMessages from '@/hooks/useUnseenMessages';
import { Scene, Event } from 'react-native-tab-view/lib/typescript/src/types';


const FirstRoute = () => <TroChuyenScreen />;
const SecondRoute = () => <HomThuScreen />;
const ThirdRoute = () => <KhuyenMaiScreen />;

const renderScene = SceneMap({
    first: FirstRoute,
    // second: SecondRoute,
    third: ThirdRoute
});

export default function NotificationScreen() {
    const { unseenCount } = useUnseenMessages();
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Trò chuyện' },
        // { key: 'second', title: 'Hòm thư' },
        { key: 'third', title: 'Tin tức' }
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => renderTabBar(props, unseenCount)} // Pass unseenCount here
        />
    );
}
const renderTabBar = (props: (SceneRendererProps & { navigationState: NavigationState<{ key: string; title: string; }>; }) | (React.JSX.IntrinsicAttributes & SceneRendererProps & { navigationState: NavigationState<Route>; scrollEnabled?: boolean; bounces?: boolean; activeColor?: string; inactiveColor?: string; pressColor?: string; pressOpacity?: number; getLabelText?: ((scene: Scene<Route>) => string | undefined) | undefined; getAccessible?: ((scene: Scene<Route>) => boolean | undefined) | undefined; getAccessibilityLabel?: ((scene: Scene<Route>) => string | undefined) | undefined; getTestID?: ((scene: Scene<Route>) => string | undefined) | undefined; renderLabel?: ((scene: Scene<Route> & { focused: boolean; color: string; }) => React.ReactNode) | undefined; renderIcon?: ((scene: Scene<Route> & { focused: boolean; color: string; }) => React.ReactNode) | undefined; renderBadge?: ((scene: Scene<Route>) => React.ReactNode) | undefined; renderIndicator?: ((props: TabBarIndicatorProps<Route>) => React.ReactNode) | undefined; renderTabBarItem?: ((props: TabBarItemProps<Route> & { key: string; }) => React.ReactElement) | undefined; onTabPress?: ((scene: Scene<Route> & Event) => void) | undefined; onTabLongPress?: ((scene: Scene<Route>) => void) | undefined; tabStyle?: StyleProp<ViewStyle>; indicatorStyle?: StyleProp<ViewStyle>; indicatorContainerStyle?: StyleProp<ViewStyle>; labelStyle?: StyleProp<TextStyle>; contentContainerStyle?: StyleProp<ViewStyle>; style?: StyleProp<ViewStyle>; gap?: number; testID?: string; android_ripple?: PressableAndroidRippleConfig; }), unseenCount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
    <TabBar
        {...props}
        getLabelText={({ route }) => route.title}
        indicatorStyle={{ backgroundColor: '#51B81A' }}
        style={{ backgroundColor: '#F2F2F2' }}
        activeColor="#51B81A"
        inactiveColor="#656565"
        scrollEnabled={false}
        bounces={true}
        renderLabel={({ route, focused, color }) => (
            <View className='flex-row gap-1 justify-center items-center'>
                <Text style={{ color }} className='font-pbold'>
                    {route.title}
                </Text>
                {
                    route.key === "first" && unseenCount != 0
                        ?
                        <View className='w-[19px] h-[19px] bg-[#D7443A] rounded-full justify-center items-center'>
                            <Text className='font-pbold text-[10px] text-white'>{unseenCount}</Text>
                        </View>
                        :
                        null
                }
            </View>
        )}
    />
);
