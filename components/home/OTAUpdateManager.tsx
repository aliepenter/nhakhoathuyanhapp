import React, { useEffect, useState } from 'react';
import { useOTAUpdate } from '@/hooks/useOTAUpdate';
import VersionUpdatePopup from './VersionUpdatePopup';

interface OTAUpdateManagerProps {
  children: React.ReactNode;
}

export default function OTAUpdateManager({ children }: OTAUpdateManagerProps) {
  const { newVersion, checkForUpdate, openAppStore } = useOTAUpdate();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const run = async () => {
      // true = có major update cần lên store, false = OTA tải ngầm hoặc không có gì
      const needStoreUpdate = await checkForUpdate();
      if (needStoreUpdate) {
        setShowPopup(true);
      }
    };

    // Kiểm tra khi app khởi động
    run();

    // Kiểm tra định kỳ mỗi 30 phút
    const interval = setInterval(run, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {children}
      {/* Popup chỉ hiện khi cần cập nhật lên Store (major update) */}
      {showPopup && newVersion ? (
        <VersionUpdatePopup
          visible={showPopup}
          version={newVersion}
          onUpdate={() => {
            openAppStore();
            setShowPopup(false);
          }}
          onClose={() => setShowPopup(false)}
          isOTAUpdate={false}
          isUpdating={false}
          updateProgress={0}
        />
      ) : null}
    </>
  );
} 