import React from 'react'
import ChatScreen from '@/screens/chat/chat.screen'
import { useRoute } from '@react-navigation/native';

export default function index() {
    const route = useRoute();
    const { headerTitle }: any = route.params;
    return (
        <ChatScreen headerTitle={headerTitle} />
    )
}