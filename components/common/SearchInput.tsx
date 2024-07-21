import { View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants';

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...pros }: any) => {

    return (
        <View
            className='space-x-4 w-full h-[50px] px-3 rounded-full focus:border-secondary flex-row bg-white mb-2 mt-4'
            style={styles.boxShadow}
        >
            <View
                className='flex-row items-center justify-center'
            >
                <TouchableOpacity onPress={() => {}}>
                    <Image source={icons.search} className='w-[28px] h-[28px]' resizeMode='contain' />
                </TouchableOpacity>
            </View>
            <TextInput className='mt-0.5 no-underline text-[17px] text-black flex-1 font-pregular'
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#3C3C43"
                onChangeText={handleChangeText}
            />
        </View>
    )
}

export default SearchInput

const styles = StyleSheet.create({
    boxShadow: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    }
});
