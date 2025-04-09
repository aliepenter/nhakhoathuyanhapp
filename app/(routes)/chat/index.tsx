import React from 'react'
import ChatScreen from '@/screens/chat/chat.screen'
import { useLocalSearchParams } from 'expo-router';

export default function index() {
    const { headerTitle, cuoc_tro_chuyen_id, status }: any = useLocalSearchParams();
    const disable: boolean = status == 0 ? true : false;
    return (
        <ChatScreen disable={disable} headerTitle={headerTitle} cuoc_tro_chuyen_id={cuoc_tro_chuyen_id} />
    )
}