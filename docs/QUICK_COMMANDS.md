# 🚀 Quick Commands Reference

## 📱 Version Management

```bash
# Xem version hiện tại
npm run version show

# Tăng version cho OTA (1.1.0 → 1.1.1)
npm run version update patch

# Tăng version cho store (1.1.0 → 1.2.0)
npm run version update minor

# Tăng major version (1.1.0 → 2.0.0)
npm run version update major
```

## 🔄 OTA Updates

```bash
# Deploy OTA với message
npm run deploy-ota "Fix bug login"

# Deploy OTA nhanh
npm run publish-ota

# Deploy cho channel cụ thể
eas update --channel production --message "Update"
eas update --channel preview --message "Test"
```

## 🏗️ Build Management

```bash
# Build development
npm run build-dev

# Build production
eas build --profile production --platform android
eas build --profile production --platform ios

# Build preview
eas build --profile preview --platform android
```

## 📊 Monitoring

```bash
# Xem danh sách updates
eas update:list

# Xem danh sách builds
eas build:list

# Xem chi tiết update
eas update:view <update-id>

# Xem logs build
eas build:view <build-id>
```

## 🔧 Troubleshooting

```bash
# Cấu hình EAS
eas update:configure

# Clear cache
npx expo install --fix

# Kiểm tra JSON syntax
node -e "JSON.parse(require('fs').readFileSync('app.json'))"

# Rebuild với clear cache
eas build --clear-cache
```

## 🎯 Common Workflows

### **Fix bug nhỏ (OTA)**
```bash
# 1. Sửa code
# 2. Test
# 3. Deploy
npm run deploy-ota "Fix crash"
```

### **Thêm tính năng (Store)**
```bash
# 1. Thêm tính năng
# 2. Tăng version
npm run version update minor
# 3. Build
eas build --profile production
# 4. Submit store
```

### **Hotfix khẩn cấp (OTA)**
```bash
# 1. Sửa bug
# 2. Deploy ngay
npm run deploy-ota "Hotfix: Critical bug"
```

## 📱 Channels

- **Development**: `development-simulator`
- **Preview**: `preview`
- **Production**: `production`

## ⚡ Quick Tips

- **OTA**: Chỉ cho JavaScript/UI changes
- **Store**: Cho native code/permissions changes
- **Test**: Luôn test trước khi deploy
- **Monitor**: Theo dõi sau khi deploy 