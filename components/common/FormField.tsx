import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants';

const FormField = ({ title, keyboardType, autoFocus, value, placeholder, handleChangeText, otherStyles, ...pros }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <View className={`space-y-2 ${otherStyles} flex items-center`}>
            <View
                className='w-11/12 bg-white rounded-2xl flex-row border-2 border-[#2594B8]'
            >
                <TextInput className='flex-1 p-4 text-black font-semibold text-base'
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'password' && !showPassword}
                    autoFocus={autoFocus}
                    keyboardType={keyboardType}
                />
                <View
                    className='flex-row items-center pr-4'
                >
                    {title === 'password' && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                            <Image source={!showPassword ? icons.eye : icons.eyeHide} className='w-6 h-6' resizeMode='contain' />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

export default FormField