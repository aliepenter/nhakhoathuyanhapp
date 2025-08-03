import { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import { Alert, Platform } from 'react-native';
import { getVersion } from '@/lib/apiCall';

export const useOTAUpdate = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  const checkForOTAUpdate = async () => {
    try {
      // Kiểm tra xem có update OTA không
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setIsUpdateAvailable(true);
        setNewVersion('Mới nhất');
        return true;
      }
      
      // Nếu không có OTA, kiểm tra version từ server
      const currentVersion = Application.nativeApplicationVersion;
      const versionData = await getVersion();
      
      if (versionData && versionData.data) {
        const latestVersion = versionData.data.number;
        
        if (currentVersion !== latestVersion) {
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
    const storeUrl = Platform.select({
      ios: `https://apps.apple.com/app/id${Application.applicationId}`,
      android: `https://play.google.com/store/apps/details?id=${Application.applicationId}`,
    });
    
    if (storeUrl) {
      // Sử dụng Linking để mở store
      import('expo-linking').then(({ openURL }) => {
        openURL(storeUrl);
      });
    }
  };

  const handleUpdate = async () => {
    if (isUpdateAvailable) {
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