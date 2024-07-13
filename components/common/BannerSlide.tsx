import {
    Image,
    View,
    ActivityIndicator,
} from "react-native";
import React from "react";
import { SERVER_URL } from "@/utils/uri";
import Swiper from 'react-native-swiper';
import { icons } from "@/constants";

export default function BannerSlide({ banners, type }: any) {
    return (
        <View className="mt-[10px] pl-[8px] pr-[8px] mb-[30px]" >
            {
                banners && banners.length != 0
                    ?
                    <Swiper
                        showsPagination={true}
                        loop={true}
                        autoplay={true}
                        paginationStyle={{ bottom: -16 }}
                        className="h-[170px] md:h-[400px]"
                        autoplayTimeout={5}
                        pagingEnabled={true}
                        loadMinimalLoader={<ActivityIndicator />}
                        loadMinimal={true}
                        loadMinimalSize={2}
                        dot={
                            <Image
                              source={icons.dot}
                              className="w-[10px] h-[10px] mx-1"
                              resizeMode='contain'
                            />
                          }
                          activeDot={
                            <Image
                              source={icons.dotActive}
                              className="w-[10px] h-[10px] mx-1"
                              resizeMode='contain'
                            />
                          }
                    >
                        {banners.map((item: Banner, index: number) => (
                            item.status === type
                                ?
                                <View key={index} className="flex-1 ml-[3px] mr-[3px]">
                                    <Image
                                        source={{ uri: `${SERVER_URL}${item.banner_path}` }}
                                        className="w-full h-full rounded-[10px]"
                                    />
                                </View>
                                :
                                null
                        ))}
                    </Swiper>
                    :
                    <View className="h-[170px] md:h-[400px] justify-center">
                        <ActivityIndicator />
                    </View>
            }
        </View>
    )
}