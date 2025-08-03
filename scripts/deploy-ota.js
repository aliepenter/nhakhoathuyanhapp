#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Đọc thông tin từ app.json
const appConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../app.json'), 'utf8'));
const projectId = appConfig.expo.extra.eas.projectId;
const currentVersion = appConfig.expo.version;

console.log('🚀 Bắt đầu deploy OTA update...');
console.log(`📱 Project ID: ${projectId}`);
console.log(`📦 Current version: ${currentVersion}`);

// Lấy message từ command line argument
const message = process.argv[2] || 'OTA Update';

try {
  // Publish OTA update
  console.log('📤 Đang publish update...');
  execSync(`eas update --channel production --message "${message}"`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('✅ OTA update đã được publish thành công!');
  console.log('📱 Khách hàng sẽ nhận được update tự động khi mở app.');
  
  // Hiển thị thông tin hữu ích
  console.log('\n📊 Thông tin update:');
  console.log(`- Channel: production`);
  console.log(`- Version: ${currentVersion}`);
  console.log(`- Message: ${message}`);
  console.log(`- Dashboard: https://expo.dev/accounts/tuandat263/projects/nha-khoa-thuy-anh/updates`);
  
} catch (error) {
  console.error('❌ Lỗi khi publish OTA update:', error.message);
  process.exit(1);
} 