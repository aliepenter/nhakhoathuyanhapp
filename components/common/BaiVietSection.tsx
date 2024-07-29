import { TouchableOpacity } from 'react-native'
import React from 'react'
import images from '@/constants/images'
import { SERVER_URL } from '@/utils/uri'
import { Image } from 'expo-image';
import { router } from 'expo-router';
type BaiVietSectionProps = {
    flag: boolean;
    setFlag: (index: boolean) => void;
    item: any;
    isLast: boolean;
    customImageStyle: any;
}
export default function BaiVietSection({ item, isLast, customImageStyle, flag, setFlag }: BaiVietSectionProps) {
    const onPress = () => {
        setFlag(true);
        router.push({
            pathname: "(routes)/tin-tuc/tinTucDetail",
            params: { postThumb: item.banner_id.banner_path, postTime: item.date, postTitle: item.title, postContent: item.content, postUrl: item.website_url },
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }
    return (
        <TouchableOpacity
            className={`${customImageStyle ? customImageStyle : "w-[200px] h-[150px]"} rounded-[20px] bg-gray-300 relative justify-center items-center ${isLast ? "" : "mr-2"}`}
            onPress={onPress}
            disabled={flag}
            activeOpacity={0.7}
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