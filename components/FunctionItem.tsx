import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function FunctionItem({ icon, title, path, otherStyles }: any) {
    return (
        <View className='items-center'>
            <View style={styles.boxShadow} className={`${otherStyles} justify-center items-center bg-[#FAFAFA] rounded-full w-[74px] h-[74px]`}>
                <Image source={icon} className='w-[40px] h-[40px]' resizeMode='contain' />
            </View>
            <Text className='text-[12px] mt-[4px]'>{title}</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    boxShadow: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 11.7,
        elevation: 10
    }
})
