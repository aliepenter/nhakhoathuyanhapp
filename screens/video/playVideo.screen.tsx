import React from 'react';
import { SafeAreaView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import CustomHeader from '@/components/common/CustomHeader';

// Đây là code dành cho android, khi làm đến ios nếu có lỗi ở play video sau khi build thì check ở đây, check version của webview,....
const PlayVideoScreen = ({ headerTitle, videoItem }: any) => {
  const windowWidth = Dimensions.get('window').width;
  const playerHeight = (windowWidth * 9) / 16;

  return (
    <>
      <CustomHeader title={headerTitle} customStyle="bg-primary" />
      <SafeAreaView className='flex-1 bg-primary'>
        <WebView
          style={{ height: playerHeight, width: windowWidth }}
          source={{ uri: `https://www.youtube.com/embed/${videoItem}?autoplay=1` }}
          javaScriptEnabled={true}
          mediaPlaybackRequiresUserAction={false}
        />
      </SafeAreaView>
    </>
  );
};

export default PlayVideoScreen;
