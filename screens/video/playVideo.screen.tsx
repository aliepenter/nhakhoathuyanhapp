import React from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { View } from "react-native-animatable";
import CustomHeader from "@/components/common/CustomHeader";

const PlayVideoScreen = ({ headerTitle, videoItem }: any) => {

  const windowWidth = useWindowDimensions().width;
  const playerHeight = (windowWidth * 9) / 16;

  return (
    <>
      <CustomHeader title={headerTitle} customStyle="bg-primary"/>
      <SafeAreaView className="bg-primary flex-1 relative">
        <View className="absolute top-[30%]">
          <YoutubePlayer
            play={true}
            height={playerHeight}
            width={windowWidth}
            videoId={videoItem}
          />
        </View>
      </SafeAreaView></>
  );
};

export default PlayVideoScreen;
