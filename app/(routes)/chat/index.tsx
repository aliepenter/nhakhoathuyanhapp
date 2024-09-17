import React from 'react'
import ChatScreen from '@/screens/chat/chat.screen'
import { useRoute } from '@react-navigation/native';

export default function index() {
    const route = useRoute();
    const { headerTitle, cuoc_tro_chuyen_id, status }: any = route.params;
    const disable: boolean = status == 0 ? true : false;
    return (
        <ChatScreen disable={disable} headerTitle={headerTitle} cuoc_tro_chuyen_id={cuoc_tro_chuyen_id} />
    )
}