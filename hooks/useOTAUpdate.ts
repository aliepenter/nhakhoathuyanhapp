import { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import { Alert, Linking, Platform } from 'react-native';
import { getVersion } from '@/lib/apiCall';

export const useOTAUpdate = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOtaAvailable, setIsOtaAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  const checkForOTAUpdate = async () => {
    try {
      // Kiểm tra xem có update OTA không
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        setIsOtaAvailable(true);
        setNewVersion('Mới nhất');
        return true;
      }
      // Nếu không có OTA, kiểm tra version từ server
      const currentVersion = Application.nativeApplicationVersion;
      const versionData = await getVersion();

      if (versionData && versionData.data) {
        const latestVersion = versionData.data.number;

        if (currentVersion !== latestVersion) {
          setIsUpdateAvailable(true);
          setNewVersion(latestVersion);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking for OTA update:', error);
      return false;
    }
  };

  const performOTAUpdate = async () => {
    try {
      setIsUpdating(true);
      setUpdateProgress(0);

      // Bắt đầu download update
      const update = await Updates.fetchUpdateAsync();

      if (update.isNew) {
        // Reload app với update mới
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Error performing OTA update:', error);
      Alert.alert(
        'Lỗi cập nhật',
        'Không thể cập nhật tự động. Vui lòng cập nhật từ App Store/Google Play.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUpdating(false);
      setUpdateProgress(0);
    }
  };

  const openAppStore = () => {
    const url =
      Platform.OS === 'android'
        ? 'market://details?id=com.anonymous.nhakhoathuyanh' // Link cho Android
        : 'https://apps.apple.com/us/app/my-braces-ni%E1%BB%81ng-r%C4%83ng-th%C3%B9y-anh/id6743517132'; // Link cho iOS

    Linking.openURL(url)
      .catch(err => console.error('Failed to open app:', err));
  };

  const handleUpdate = async () => {
    if (isOtaAvailable) {
      // Có OTA update - thực hiện cập nhật tự động
      await performOTAUpdate();
    } else {
      // Không có OTA - mở app store
      openAppStore();
    }
  };

  useEffect(() => {
    checkForOTAUpdate();
  }, []);

  return {
    isUpdateAvailable,
    isUpdating,
    updateProgress,
    newVersion,
    handleUpdate,
    checkForOTAUpdate,
  };
}; 