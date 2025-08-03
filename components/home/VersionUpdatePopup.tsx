import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '@/constants';

const { width } = Dimensions.get('window');

type VersionUpdatePopupProps = {
  visible: boolean;
  version: string;
  onUpdate: () => void;
  onClose?: () => void;
  isOTAUpdate?: boolean;
  isUpdating?: boolean;
  updateProgress?: number;
};

export default function VersionUpdatePopup({
  visible,
  version,
  onUpdate,
  onClose,
  isOTAUpdate = false,
  isUpdating = false,
  updateProgress = 0,
}: VersionUpdatePopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconBounceAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconBounceAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(iconBounceAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      slideAnim.setValue(50);
      iconBounceAnim.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    if (isUpdating) {
      Animated.timing(progressAnim, {
        toValue: updateProgress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [updateProgress, isUpdating]);

  const handleUpdate = () => {
    if (!isUpdating) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onUpdate();
    }
  };

  const handleClose = () => {
    if (onClose && !isUpdating) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
    }
  };

  const iconTranslateY = iconBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const getUpdateText = () => {
    if (isUpdating) {
      return '🔄 Đang cập nhật...';
    }
    return isOTAUpdate ? '🔄 Cập nhật tự động' : '🔄 Cập nhật ngay';
  };

  const getDescription = () => {
    if (isUpdating) {
      return 'Đang tải bản cập nhật mới. Vui lòng chờ...';
    }
    return isOTAUpdate 
      ? 'Đã có phiên bản mới. Ứng dụng sẽ tự động cập nhật và khởi động lại!'
      : 'Đã có phiên bản mới của ứng dụng. Bạn cần cập nhật để tiếp tục sử dụng!';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.popupContainer,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#4FAA57', '#1560A1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            {/* Nút đóng chỉ hiện khi có onClose và không đang update */}
            {onClose && !isUpdating && (
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            )}
            
            {/* Header with animated icon */}
            <View style={styles.header}>
              <Animated.View 
                                                   style={[
                    styles.iconContainer,
                    {
                      transform: [{ translateY: iconTranslateY }],
                    },
                  ]}
              >
                                 {isUpdating ? (
                   <ActivityIndicator size="large" color="#FFFFFF" />
                 ) : (
                   <Image source={icons.download} style={styles.icon} />
                 )}
              </Animated.View>
              <Text style={styles.title}>
                {isUpdating ? 'Đang cập nhật' : 'Cập nhật bắt buộc'}
              </Text>
              <Text style={styles.versionText}>v{version}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.description}>
                {getDescription()}
              </Text>
              
              {/* Progress bar khi đang update */}
              {isUpdating && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View 
                      style={[
                        styles.progressFill,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(updateProgress * 100)}%
                  </Text>
                </View>
              )}
              
              {!isUpdating && (
                <View style={styles.featuresContainer}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>✨ Tính năng mới và cải tiến</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>🔧 Sửa lỗi và tối ưu hiệu suất</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>🔒 Bảo mật được nâng cấp</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Update button */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  styles.updateButton,
                  isUpdating && styles.updateButtonDisabled
                ]}
                onPress={handleUpdate}
                disabled={isUpdating}
                android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.updateButtonGradient}
                >
                  <Text style={styles.updateButtonText}>
                    {getUpdateText()}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  popupContainer: {
    width: width * 0.85,
    maxWidth: 350,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gradientBackground: {
    padding: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  iconEmoji: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  content: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
  updateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1560A1',
  },
}); 