import {
    Image,
    ImageBackground,
    Text,
    View,
  } from "react-native";
  import React from "react";
  import { icons, images } from "@/constants";

  import { SERVER_URL } from "@/utils/uri";

export default function HeaderSection({ user }: any) {
    return (
        <View className="h-[150px]">
            <ImageBackground source={images.bgHeaderHome} resizeMode='stretch' className='flex-1'>
                <View className="flex-row flex-1 justify-start ml-7 mt-8 items-center">
                    <Image source={{ uri: `${SERVER_URL}${user?.anh_dai_dien}` }} resizeMode='contain' className='rounded-[50px] w-[100px] h-[100px]' />
                    <View className="ml-6">
                        <View className="flex-row items-center">
                            <Text className="text-white text-[14px]">Xin chào, </Text>
                            <Text className="text-white size-[14px] font-pbold">{user?.ho_va_ten}</Text>
                        </View>
                        <Text className="text-white text-[14px] font-pbold my-1">{user?.so_dien_thoai}</Text>
                        <Text className="text-white text-[14px] font-semibold">{user?.dia_chi}</Text>
                    </View>
                </View>
                <View className="absolute top-[30%] right-6">
                    <View>
                        <Image source={icons.notificationHeader} resizeMode='contain' className='w-[20px] h-[21px]' />
                        <Image source={icons.notificationHighlight} resizeMode='contain' className='w-[14px] h-[14px] absolute left-2 bottom-3' />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}