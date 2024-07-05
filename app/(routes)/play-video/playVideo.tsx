import React, { useEffect } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { useWindowDimensions } from "react-native";
import { View } from "react-native-animatable";

const PlayVideo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoItem, headerTitle }: any = route.params;
  const windowWidth = useWindowDimensions().width;
  const playerHeight = (windowWidth * 9) / 16;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitle,
    });
  }, []);

  return (
    <SafeAreaView className="bg-primary flex-1 relative">
      <View className="absolute top-56 items-center">
        <YoutubePlayer
          play={true}
          height={playerHeight}
          width={windowWidth}
          videoId={videoItem}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlayVideo;
