import { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import { Linking, Platform } from 'react-native';
import { getVersion } from '@/lib/apiCall';
import { isVersionAllowed, parseAllowedVersions } from '@/utils/version';

export const useOTAUpdate = () => {
  const [isMajorUpdateAvailable, setIsMajorUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);

  /**
   * Tải OTA ngầm (silent) - không hiện popup, lần sau mở app là version mới
   */
  const performSilentOTAUpdate = async () => {
    if (!Updates.isEnabled || __DEV__) return;
    try {
      const update = await Updates.fetchUpdateAsync();
      if (update.isNew) {
        console.log('[OTA] Đã tải bản cập nhật ngầm, sẽ áp dụng lần mở tiếp theo.');
        // Không gọi reloadAsync() - update sẽ tự áp dụng lần mở app tiếp theo
      }
    } catch (error) {
      console.error('[OTA] Lỗi tải ngầm:', error);
    }
  };

  /**
   * Kiểm tra update:
   * - Có OTA → tải ngầm background, trả về false (không hiện popup)
   * - Có major update từ server → trả về true (hiện popup store)
   */
  const checkForUpdate = async (): Promise<boolean> => {
    if (!Updates.isEnabled || __DEV__) return false;

    try {
      // Ưu tiên kiểm tra OTA trước
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        // Tải ngầm, không hiện popup
        performSilentOTAUpdate();
        return false;
      }

      // Không có OTA → kiểm tra major version từ server
      const currentVersion = Application.nativeApplicationVersion;
      const versionData = await getVersion();

      if (versionData && versionData.data) {
        const rawVersion = versionData.data.number;
        const allowedVersions = parseAllowedVersions(rawVersion);
        const shouldForceUpdate = !isVersionAllowed(currentVersion, rawVersion);

        if (shouldForceUpdate) {
          setIsMajorUpdateAvailable(true);
          setNewVersion(allowedVersions[0] || String(rawVersion || ''));
          return true; // Hiện popup store
        }
      }

      return false;
    } catch (error) {
      console.error('[Update] Lỗi kiểm tra update:', error);
      return false;
    }
  };

  const openAppStore = () => {
    const url =
      Platform.OS === 'android'
        ? 'market://details?id=com.anonymous.nhakhoathuyanh'
        : 'https://apps.apple.com/us/app/my-braces-ni%E1%BB%81ng-r%C4%83ng-th%C3%B9y-anh/id6743517132';
    Linking.openURL(url).catch(err => console.error('Failed to open store:', err));
  };

  return {
    isMajorUpdateAvailable,
    newVersion,
    checkForUpdate,
    openAppStore,
  };
}; 