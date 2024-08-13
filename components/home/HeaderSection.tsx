import {
    Image,
    ImageBackground,
    Text,
    View,
} from "react-native";
import React from "react";
import { icons, images } from "@/constants";

import { SERVER_URL } from "@/utils/uri";
type HeaderSectionProps = {
    showNotification: any;
    user: any;
}
export default function HeaderSection({ user, showNotification }: HeaderSectionProps) {
    return (
        <View className="h-[150px]">
            <ImageBackground source={images.bgHeaderHome} resizeMode='stretch' className='flex-1'>
                <View className="flex-row flex-1 justify-start ml-7 mt-8 items-center">
                    <View>
                        <Image source={{ uri: `${SERVER_URL}${user?.anh_dai_dien}` }} resizeMode='contain' className='rounded-[50px] w-[100px] h-[100px]' />
                        <View className="absolute bg-white bottom-[5px] right-[5px] rounded-[50px] w-[20px] h-[20px] justify-center items-center">
                            <Image source={icons.booking} resizeMode='contain' className='w-[70%] h-[70%]' />
                        </View>
                    </View>
                    <View className="ml-4">
                        <View className="flex-row items-center w-[70%]">
                            <Text className="text-white text-[14px] md:text-[18px]">Xin chào, </Text>
                            <Text className="text-white text-[14px] md:text-[18px] font-pbold">{user?.ho_va_ten}</Text>
                        </View>
                        <Text className="text-white text-[14px] md:text-[18px] font-pbold my-1">{user?.so_dien_thoai}</Text>
                        <Text className="text-white text-[14px] md:text-[18px] font-semibold">{user?.dia_chi}</Text>
                    </View>
                </View>
                {
                    showNotification
                        ?
                        <View className="absolute top-[30%] right-6 md:top-[35%] md:right-12">
                            <Image source={icons.notificationHeader} resizeMode='contain' className='w-[20px] h-[21px] md:w-[30px] md:h-[31px]' />
                            <Image source={icons.notificationHighlight} resizeMode='contain' className='w-[14px] h-[14px] absolute left-2 bottom-3 md:left-4 md:bottom-5' />
                        </View>
                        :
                        null
                }

            </ImageBackground>
        </View>
    )
}