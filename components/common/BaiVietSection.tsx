import { TouchableOpacity } from 'react-native'
import React from 'react'
import images from '@/constants/images'
import { SERVER_URL } from '@/utils/uri'
import { Image } from 'expo-image';

export default function BaiVietSection({ item, isLast, customImageStyle, onPress }: any) {
    return (
        <TouchableOpacity
            className={`${customImageStyle ? customImageStyle : "w-[200px] h-[150px]"} rounded-[20px] bg-gray-300 relative justify-center items-center ${isLast ? "" : "mr-2"}`}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <Image
                source={item && item.banner_id ? { uri: `${SERVER_URL}${item.banner_id.banner_path}` } : images.bannerDefault}
                className={`w-full h-full overflow-hidden rounded-[20px]`}
                contentFit="cover"
                transition={500}
            />
        </TouchableOpacity>
    )
}