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

const TrendingItem = ({ item, isLast }: any) => {
  const onPress = () =>
    router.push({
      pathname: "(routes)/play-video",
      params: { videoItem: item.video_url, headerTitle: item.video_title },
    });
  return (
    <TouchableOpacity
      className={`relative justify-center items-center ${isLast?"":"mr-2"}`}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <ImageBackground
        source={item.video_thumbnail ? { uri: `${SERVER_URL}${item.video_thumbnail}` } : images.bannerDefault}
        className="w-80 h-48 overflow-hidden rounded-[20px]"
        resizeMode="stretch"  
      />
      <Image
        source={icons.play}
        className="w-12 h-12 absolute"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const Trending = ({ posts }: any) => {


  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <TrendingItem item={item} isLast={index === posts.length - 1}/>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;
