import { useState, useEffect } from 'react';
import * as Application from 'expo-application';
import { getVersion } from '@/lib/apiCall';

export const useVersionUpdate = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [newVersionStore, setNewVersionStore] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkForUpdate = async () => {
    try {
      setIsChecking(true);
      const currentVersion = Application.nativeApplicationVersion;
      console.log('currentVersion', currentVersion);
      const versionData = await getVersion();
      if (versionData && versionData.data) {
        const latestVersion = versionData.data.number;
        if (currentVersion !== latestVersion) {
          setNewVersionStore(latestVersion);
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
    newVersionStore,
    isChecking,
    closePopup,
    checkForUpdate,
  };
}; 