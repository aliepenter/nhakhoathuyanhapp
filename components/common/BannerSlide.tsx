import {
    View,
    ActivityIndicator,
    FlatList,
    Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SERVER_URL } from "@/utils/uri";
import { icons } from "@/constants";
import { Image } from 'expo-image';

export default function BannerSlide({ banners, type }: any) {
    const filteredBanners = useMemo(
        () => (Array.isArray(banners) ? banners.filter((item: Banner) => item.status === type) : []),
        [banners, type]
    );
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<FlatList>(null);
    const { width } = Dimensions.get("window");

    useEffect(() => {
        setActiveIndex(0);
    }, [type, filteredBanners.length]);

    useEffect(() => {
        if (filteredBanners.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => {
                const next = (prev + 1) % filteredBanners.length;
                listRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [filteredBanners.length]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0 && typeof viewableItems[0].index === "number") {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

    const getItemLayout = useCallback(
        (_: any, index: number) => ({
            length: width - 16,
            offset: (width - 16) * index,
            index,
        }),
        [width]
    );

    return (
        <View className="mt-[10px] pl-[8px] pr-[8px] mb-[10px]" >
            {
                filteredBanners.length !== 0
                    ?
                    <>
                        <FlatList
                            ref={listRef}
                            data={filteredBanners}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item: Banner, index: number) => `${item.id ?? index}`}
                            getItemLayout={getItemLayout}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            renderItem={({ item }) => (
                                <View className="h-[170px] md:h-[400px] w-full ml-[3px] mr-[3px]">
                                    <Image
                                        source={{ uri: `${SERVER_URL}${item.banner_path}` }}
                                        className="w-full h-full rounded-[10px]"
                                        contentFit='cover'
                                    />
                                </View>
                            )}
                        />
                        <View className="flex-row justify-center mt-2">
                            {filteredBanners.map((_: Banner, index: number) => (
                                <Image
                                    key={index}
                                    source={activeIndex === index ? icons.dotActive : icons.dot}
                                    className="w-[10px] h-[10px] mx-1"
                                    contentFit='contain'
                                />
                            ))}
                        </View>
                    </>
                    :
                    <View className="h-[170px] md:h-[400px] justify-center">
                        <ActivityIndicator color={'#00E5E5'} />
                    </View>
            }
        </View>
    )
}