import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import { SERVER_URL } from "@/utils/uri";

const zoomIn: any = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut: any = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }: any) => {
  const onPress = () =>
    router.push({
      pathname: "(routes)/play-video",
      params: { videoItem: item.video_url, headerTitle: item.video_title },
    });
  return (
    <Animatable.View
      animation={activeItem === item.id ? zoomIn : zoomOut}
      duration={500}
    >
      <TouchableOpacity
        className="relative justify-center items-center"
        activeOpacity={0.7}
        onPress={onPress}
      >
        <ImageBackground
          source={item.video_thumbnail?{ uri: `${SERVER_URL}${item.video_thumbnail}` }:images.bannerDefault}
          className="w-80 h-48 overflow-hidden rounded-[20px]"
          resizeMode="stretch"
        />
        <Image
          source={icons.play}
          className="w-12 h-12 absolute"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animatable.View>
  );
};

const Trending = ({ posts }: any) => {
  const [activeItem, setActiveItem] = useState(posts[0]);
  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 40,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;
