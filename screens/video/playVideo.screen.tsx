import React, { useMemo } from 'react';
import {
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/common/CustomHeader';

// Đây là code dành cho android, khi làm đến ios nếu có lỗi ở play video sau khi build thì check ở đây, check version của webview,....
const getYoutubeVideoId = (value: string) => {
  if (!value) return '';

  // Support direct IDs and common YouTube URL formats from API data.
  const normalized = value.trim();
  const directIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (directIdPattern.test(normalized)) return normalized;

  const idFromVParam = normalized.match(/[?&]v=([^&#]+)/)?.[1];
  if (idFromVParam && directIdPattern.test(idFromVParam)) return idFromVParam;

  const idFromShortUrl = normalized.match(/youtu\.be\/([^?&#/]+)/)?.[1];
  if (idFromShortUrl && directIdPattern.test(idFromShortUrl)) return idFromShortUrl;

  const idFromEmbed = normalized.match(/embed\/([^?&#/]+)/)?.[1];
  if (idFromEmbed && directIdPattern.test(idFromEmbed)) return idFromEmbed;

  return '';
};

const PlayVideoScreen = ({ headerTitle, videoItem }: any) => {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const playerHeight = (windowWidth - 32) * 0.5625;
  const videoUrl = Array.isArray(videoItem) ? videoItem[0] : videoItem;
  const normalizedTitle = Array.isArray(headerTitle) ? headerTitle[0] : headerTitle;
  const videoId = useMemo(() => getYoutubeVideoId(videoUrl || ''), [videoUrl]);

  const handleOpenYoutube = async () => {
    if (!videoId) return;
    await Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  };

  return (
    <>
      <CustomHeader title="" customStyle="bg-primary" />
      <LinearGradient
        colors={['#0F2547', '#1E8368', '#06203C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.screenBackground}
      >
        <SafeAreaView className='flex-1'>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            <View className='px-4 mt-3'>
              <Text className='text-white font-semibold text-[22px] leading-[30px]' numberOfLines={2}>
                {normalizedTitle || 'Video YouTube'}
              </Text>
              <Text className='text-white/70 text-[13px] mt-2'>
                Xem video với giao diện tối ưu trên ứng dụng, âm thanh và khung hình ổn định hơn.
              </Text>
            </View>
          {
            videoId
              ? (
                <View className='px-4 mt-4'>
                  <View style={styles.playerCard}>
                    <YoutubePlayer
                      height={playerHeight}
                      width={windowWidth - 32}
                      play
                      videoId={videoId}
                      initialPlayerParams={{
                        autoplay: true,
                        rel: false,
                        modestbranding: true,
                      }}
                    />
                  </View>

                  <View style={styles.infoCard}>
                    <View className='flex-row items-center'>
                      <View style={styles.badge}>
                        <Ionicons name='play-circle' size={16} color='#9EE8D3' />
                        <Text style={styles.badgeText}>Youtube Video</Text>
                      </View>
                    </View>

                    <Text className='text-white text-[17px] font-semibold mt-3' numberOfLines={2}>
                      {normalizedTitle || 'Nội dung video'}
                    </Text>

                    <Text className='text-white/70 text-[13px] mt-2 leading-5'>
                      Nếu video gặp giới hạn phát trong app, bạn có thể mở trực tiếp trên Youtube hoặc quay lại để chọn video khác.
                    </Text>

                    <View className='flex-row mt-4'>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={handleOpenYoutube}
                      >
                        <Ionicons name='logo-youtube' size={18} color='#0B2C24' />
                        <Text style={styles.primaryButtonText}>Mở Youtube</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => router.back()}
                      >
                        <Ionicons name='arrow-back' size={18} color='#FFFFFF' />
                        <Text style={styles.secondaryButtonText}>Quay lại</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
              : (
                <View className='flex-1 items-center justify-center px-6'>
                  <Text className='text-white text-center text-base'>
                    Video YouTube không hợp lệ hoặc đã bị giới hạn phát trên ứng dụng.
                  </Text>
                </View>
              )
          }
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  screenBackground: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 34,
  },
  playerCard: {
    backgroundColor: '#05060B',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  infoCard: {
    marginTop: 14,
    backgroundColor: 'rgba(3, 15, 35, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(130, 247, 207, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(130, 247, 207, 0.4)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#C7FFEE',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#9EE8D3',
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  primaryButtonText: {
    color: '#0B2C24',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default PlayVideoScreen;
