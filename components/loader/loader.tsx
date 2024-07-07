import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedLoader from "react-native-animated-loader";

export default function Loader() {
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <AnimatedLoader
        visible={true}
        overlayColor="#5EBA1B"
        source={require("@/assets/animation/0FPn2SKuz4.json")}
        animationStyle={{ width: 250, height: 250 }}
        speed={1.6}
      />
    </LinearGradient>
  );
}
