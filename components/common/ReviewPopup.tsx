import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

export type ReviewPopupProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; content: string }) => void;
  loading?: boolean;
  title?: string;
  description?: string;
};

export default function ReviewPopup({
  visible,
  onClose,
  onSubmit,
  loading = false,
  title = 'Đánh giá buổi chỉnh nha',
  description = 'Hãy cho chúng tôi biết cảm nhận của bạn về buổi khám hôm nay!',
}: ReviewPopupProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [showError, setShowError] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      slideAnim.setValue(50);
      setRating(0);
      setContent('');
      setShowError(false);
      setKeyboardVisible(false);
    }
  }, [visible]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleStarPress = (star: number) => {
    setRating(star);
    setShowError(false); // Ẩn lỗi khi user chọn sao
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSend = () => {
    if (rating === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setShowError(true);
      return;
    }
    onSubmit({ rating, content });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50}
      >
        <Animated.View
          style={[
            styles.overlay,
            { opacity: opacityAnim },
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
              {/* Nút bỏ qua */}
              <Pressable style={styles.skipButton} onPress={onClose}>
                <Text style={styles.skipButtonText}>Bỏ qua</Text>
              </Pressable>
              {/* Tiêu đề */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              {/* Chọn số sao */}
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() => handleStarPress(star)}
                    hitSlop={8}
                  >
                    <FontAwesome
                      name={rating >= star ? 'star' : 'star-o'}
                      size={36}
                      color={rating >= star ? '#FFD700' : '#fff'}
                      style={styles.star}
                    />
                  </Pressable>
                ))}
              </View>
              {/* Thông báo lỗi */}
              {showError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ Vui lòng chọn số sao từ 1-5</Text>
                </View>
              )}
              {/* Nhập nội dung */}
              <TextInput
                style={styles.input}
                placeholder="Nhập ý kiến của bạn..."
                placeholderTextColor="#E0E0E0"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
                editable={!loading}
                textAlignVertical="top"
              />
              {/* Nút gửi */}
              <Pressable
                style={[styles.sendButton, loading && { opacity: 0.7 }]}
                onPress={handleSend}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  style={styles.sendButtonGradient}
                >
                  <Text style={styles.sendButtonText}>{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</Text>
                </LinearGradient>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  popupContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gradientBackground: {
    padding: 24,
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    zIndex: 1,
  },
  skipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 32, // tăng marginTop để tránh bị đè bởi nút bỏ qua
  },
  description: {
    fontSize: 15,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 18,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 8,
  },
  star: {
    marginHorizontal: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 18,
    alignItems: 'center',
  },
  errorText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    minHeight: 80,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sendButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1560A1',
  },
}); 