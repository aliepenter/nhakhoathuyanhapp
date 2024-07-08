import {
  FlatList,
} from "react-native";
import React from "react";
import VideoSection from "./VideoSection";

const Trending = ({ posts }: any) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <VideoSection item={item} isLast={index === posts.length - 1}/>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;
