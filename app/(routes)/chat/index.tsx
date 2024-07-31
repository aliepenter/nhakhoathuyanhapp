import React from 'react'
import ChatScreen from '@/screens/chat/chat.screen'
import { useRoute } from '@react-navigation/native';

export default function index() {
    const route = useRoute();
    const { headerTitle, cuoc_tro_chuyen_id }: any = route.params;
    return (
        <ChatScreen headerTitle={headerTitle} cuoc_tro_chuyen_id={cuoc_tro_chuyen_id} />
    )
}