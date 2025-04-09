import React from "react";
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

export default function Loader() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/animation/splash.json')} // bạn cần file Lottie ở đây
        autoPlay
        loop
        duration={2000}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});