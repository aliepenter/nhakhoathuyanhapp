import React from "react";
import AnimatedLoader from "react-native-animated-loader";

export default function Loader() {
  return (
    <AnimatedLoader
      visible={true}
      overlayColor="#F1F1F1"
      source={require("@/assets/animation/0FPn2SKuz4.json")}
      animationStyle={{ width: 250, height: 250 }}
      speed={1.6}
    />
  );
}
