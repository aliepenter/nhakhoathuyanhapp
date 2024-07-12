import { Image, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import images from '@/constants/images'
import { SERVER_URL } from '@/utils/uri'

export default function BaiVietSection({ item, isLast, customImageStyle }: any) {
    return (
        <TouchableOpacity
            className={`relative justify-center items-center ${isLast ? "" : "mr-2"}`}
            activeOpacity={0.7}
            onPress={()=>{}}
        >
            <Image
                source={item && item.banner_id ? { uri: `${SERVER_URL}${item.banner_id.banner_path}` } : images.bannerDefault}
                className={`${customImageStyle ? customImageStyle : "w-[200px] h-[150px]"} overflow-hidden rounded-[20px]`}
                resizeMode="stretch"
            />
        </TouchableOpacity>
    )
}