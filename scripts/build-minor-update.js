#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Minor Update v1.2.0...');

try {
  // Check current version
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  const version = appJson.expo.version;
  const versionCode = appJson.expo.android.versionCode;
  
  console.log(`📱 Current Version: ${version} (${versionCode})`);
  
  // Clean install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Check for any linting issues
  console.log('🔍 Checking for linting issues...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ Linting passed');
  } catch (error) {
    console.log('⚠️  Linting issues found, but continuing...');
  }
  
  // Build for Android
  console.log('🔨 Building for Android...');
  execSync('eas build --platform android --clear-cache', { stdio: 'inherit' });
  
  // Build for iOS (optional)
  console.log('🍎 Building for iOS...');
  execSync('eas build --platform ios --clear-cache', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  console.log(`📱 Version ${version} (${versionCode}) is ready for deployment`);
  
  // Create deployment checklist
  const checklist = `
# Deployment Checklist v${version}

## ✅ Completed
- [x] Version updated to ${version}
- [x] Version code updated to ${versionCode}
- [x] Dependencies installed
- [x] Android build completed
- [x] iOS build completed

## 🔄 Next Steps
- [ ] Test builds on devices
- [ ] Submit to Google Play Store
- [ ] Submit to Apple App Store
- [ ] Update OTA if needed

## 📝 Changes in this version
- Fixed Android camera permissions issue
- Improved avatar upload with immediate feedback
- Fixed camera layout on Android
- Updated to use Photo Picker API
- Removed expo-media-library dependency

## 🚀 Commands
\`\`\`bash
# Submit to stores
eas submit --platform android
eas submit --platform ios

# OTA Update (if needed)
eas update --branch production --message "v${version} - Camera and Avatar fixes"
\`\`\`
  `;
  
  fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
  console.log('📋 Deployment checklist created: DEPLOYMENT_CHECKLIST.md');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 