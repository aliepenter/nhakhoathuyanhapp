import { View, Text } from 'react-native'
import React from 'react'
import CustomHeader from '@/components/common/CustomHeader'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ChatScreen({ headerTitle }: any) {
    return (
        <>
            <CustomHeader title={headerTitle} />
            <SafeAreaView className="flex-1 relative">
                
            </SafeAreaView>
        </>
    )
}