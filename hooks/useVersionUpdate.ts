import { useState, useEffect } from 'react';
import * as Application from 'expo-application';
import { getVersion } from '@/lib/apiCall';

export const useVersionUpdate = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkForUpdate = async () => {
    try {
      setIsChecking(true);
      const currentVersion = Application.nativeApplicationVersion;
      const versionData = await getVersion();
      if (versionData && versionData.data) {
        const latestVersion = versionData.data.number;
        if (currentVersion !== latestVersion) {
          setNewVersion(latestVersion);
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }
      }
    } catch (error) {
      console.error('Error checking for version update:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  return {
    showPopup,
    newVersion,
    isChecking,
    closePopup,
    checkForUpdate,
  };
}; 