import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants';

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...pros }: any) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View
            className='space-x-4 w-full h-16 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary flex-row'
        >
            <TextInput className='mt-0.5 text-base text-white flex-1 font-pregular'
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7b7b8b"
                onChangeText={handleChangeText}
                secureTextEntry={title === 'Password' && !showPassword}
            />
            <View
                className='flex-row items-center pr-4'
            >
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                    <Image source={icons.search} className='w-6 h-6' resizeMode='contain' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SearchInput