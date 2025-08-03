#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Đọc thông tin từ app.json
const appConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../app.json'), 'utf8'));
const projectId = appConfig.expo.extra.eas.projectId;

console.log('Publishing OTA update...');
console.log(`Project ID: ${projectId}`);

try {
  execSync('eas update --channel production --message "OTA Update"', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('OTA update published successfully!');
  
} catch (error) {
  console.error('Error publishing OTA update:', error.message);
  process.exit(1);
} 