import React, { useEffect, useState } from 'react';
import { useOTAUpdate } from '@/hooks/useOTAUpdate';
import VersionUpdatePopup from './VersionUpdatePopup';

interface OTAUpdateManagerProps {
  children: React.ReactNode;
}

export default function OTAUpdateManager({ children }: OTAUpdateManagerProps) {
  const {
    isUpdateAvailable,
    isUpdating,
    updateProgress,
    newVersion,
    handleUpdate,
    checkForOTAUpdate,
  } = useOTAUpdate();

  const [showPopup, setShowPopup] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    const checkUpdate = async () => {
      const hasOTAUpdate = await checkForOTAUpdate();
      if (hasOTAUpdate) {
        setHasUpdate(true);
        setShowPopup(true);
      }
    };

    // Kiểm tra update khi app khởi động
    checkUpdate();

    // Kiểm tra update định kỳ (mỗi 30 phút)
    const interval = setInterval(checkUpdate, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkForOTAUpdate]);

  const handleUpdatePress = async () => {
    await handleUpdate();
    // Nếu là OTA update, popup sẽ tự động đóng khi app reload
    if (!isUpdateAvailable) {
      setShowPopup(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {children}
      <VersionUpdatePopup
        visible={showPopup && hasUpdate}
        version={newVersion || 'Mới nhất'}
        onUpdate={handleUpdatePress}
        onClose={handleClosePopup}
        isOTAUpdate={isUpdateAvailable}
        isUpdating={isUpdating}
        updateProgress={updateProgress}
      />
    </>
  );
} 