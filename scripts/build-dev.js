#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Bắt đầu build development app...');

// Kiểm tra eas.json
const easConfigPath = path.join(__dirname, '../eas.json');
if (!fs.existsSync(easConfigPath)) {
  console.log('📝 Tạo file eas.json...');
  const easConfig = {
    "cli": {
      "version": ">= 5.9.1"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal",
        "android": {
          "gradleCommand": ":app:assembleDebug"
        },
        "ios": {
          "buildConfiguration": "Debug"
        }
      },
      "preview": {
        "distribution": "internal"
      },
      "production": {}
    },
    "submit": {
      "production": {}
    }
  };
  
  fs.writeFileSync(easConfigPath, JSON.stringify(easConfig, null, 2));
  console.log('✅ eas.json đã được tạo');
}

try {
  console.log('📱 Đang build development app cho Android...');
  execSync('eas build --profile development --platform android', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ Development build đã hoàn thành!');
  console.log('📥 Tải xuống và cài đặt app trên device');
  console.log('🧪 Sau đó có thể test OTA updates');
  
} catch (error) {
  console.error('❌ Lỗi khi build:', error.message);
  console.log('\n💡 Hướng dẫn khắc phục:');
  console.log('1. Đăng nhập EAS: eas login');
  console.log('2. Cấu hình project: eas build:configure');
  console.log('3. Thử lại: npm run build-dev');
} 