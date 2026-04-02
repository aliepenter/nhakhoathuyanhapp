import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import KhuyenMaiScreen from './khuyenMai.screen';
import TroChuyenScreen from './troChuyen.screen';
import useUnseenMessages from '@/hooks/useUnseenMessages';

type NotificationTab = 'chat' | 'news';

export default function NotificationScreen() {
    const { unseenCount } = useUnseenMessages();
    const [activeTab, setActiveTab] = useState<NotificationTab>('chat');

    const tabItems = useMemo(() => [
        { key: 'chat' as const, title: 'Trò chuyện' },
        { key: 'news' as const, title: 'Tin tức' },
    ], []);

    return (
        <View className='flex-1 bg-[#F2F2F2]'>
            <View className='flex-row bg-[#F2F2F2]'>
                {tabItems.map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                        <Pressable
                            key={tab.key}
                            className='flex-1 items-center py-4 border-b-2'
                            style={{ borderBottomColor: isActive ? '#51B81A' : 'transparent' }}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <View className='flex-row gap-1 justify-center items-center'>
                                <Text
                                    className='font-pbold'
                                    style={{ color: isActive ? '#51B81A' : '#656565' }}
                                >
                                    {tab.title}
                                </Text>
                                {tab.key === 'chat' && unseenCount !== 0 ? (
                                    <View className='w-[19px] h-[19px] bg-[#D7443A] rounded-full justify-center items-center'>
                                        <Text className='font-pbold text-[10px] text-white'>{unseenCount}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            <View className='flex-1'>
                {activeTab === 'chat' ? <TroChuyenScreen /> : <KhuyenMaiScreen />}
            </View>
        </View>
    );
}
