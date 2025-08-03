#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, '../app.json');
const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

function getCurrentVersion() {
  return {
    version: appConfig.expo.version,
    androidVersionCode: appConfig.expo.android?.versionCode || 1,
    iosBuildNumber: appConfig.expo.ios?.buildNumber || '1'
  };
}

function updateVersion(type = 'patch') {
  const current = getCurrentVersion();
  const [major, minor, patch] = current.version.split('.').map(Number);
  
  let newVersion;
  let newAndroidVersionCode = current.androidVersionCode;
  let newIosBuildNumber = current.iosBuildNumber;
  
  switch(type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      newAndroidVersionCode = current.androidVersionCode + 10;
      newIosBuildNumber = (parseInt(current.iosBuildNumber) + 10).toString();
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      newAndroidVersionCode = current.androidVersionCode + 1;
      newIosBuildNumber = (parseInt(current.iosBuildNumber) + 1).toString();
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      // Không tăng version code cho patch (OTA updates)
      break;
    default:
      console.error('Invalid version type. Use: major, minor, or patch');
      process.exit(1);
  }
  
  // Update app.json
  appConfig.expo.version = newVersion;
  if (appConfig.expo.android) {
    appConfig.expo.android.versionCode = newAndroidVersionCode;
  }
  if (appConfig.expo.ios) {
    appConfig.expo.ios.buildNumber = newIosBuildNumber;
  }
  
  fs.writeFileSync(appJsonPath, JSON.stringify(appConfig, null, 2));
  
  console.log('📦 Version updated:');
  console.log(`- Version: ${current.version} → ${newVersion}`);
  console.log(`- Android Version Code: ${current.androidVersionCode} → ${newAndroidVersionCode}`);
  console.log(`- iOS Build Number: ${current.iosBuildNumber} → ${newIosBuildNumber}`);
  
  return {
    oldVersion: current.version,
    newVersion,
    type
  };
}

function showCurrentVersion() {
  const current = getCurrentVersion();
  console.log('📱 Current version info:');
  console.log(`- Version: ${current.version}`);
  console.log(`- Android Version Code: ${current.androidVersionCode}`);
  console.log(`- iOS Build Number: ${current.iosBuildNumber}`);
}

const command = process.argv[2];
const type = process.argv[3];

switch(command) {
  case 'show':
    showCurrentVersion();
    break;
  case 'update':
    if (!type) {
      console.error('Usage: node version-manager.js update <major|minor|patch>');
      process.exit(1);
    }
    updateVersion(type);
    break;
  default:
    console.log('Usage:');
    console.log('  node version-manager.js show');
    console.log('  node version-manager.js update <major|minor|patch>');
    console.log('');
    console.log('Examples:');
    console.log('  node version-manager.js update patch  # For OTA updates');
    console.log('  node version-manager.js update minor  # For store updates');
    console.log('  node version-manager.js update major  # For major releases');
} 