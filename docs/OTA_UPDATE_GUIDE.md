# 📱 OTA Update & Version Management Guide

## 🎯 Tổng quan

Hệ thống OTA (Over-The-Air) cho phép cập nhật app mà không cần submit lên app stores. Hướng dẫn này bao gồm tất cả các câu lệnh cần thiết.

## 📋 Quy trình Version Management

### **🔄 Minor Updates (New Features)**
```bash
# 1. Thêm tính năng mới
# 2. Tăng minor version
npm run version update minor
# 3. Build và submit store
eas build --profile production
```

### **🔧 Patch Updates (Bug fixes)**
```bash
# 1. Sửa bug nhỏ
# 2. KHÔNG thay đổi version
# 3. Deploy OTA
npm run deploy-ota "Mô tả fix"
```

### **🚀 Major Updates (Breaking changes)**
```bash
# 1. Thay đổi lớn
# 2. Tăng major version
npm run version update major
# 3. Build và submit store
eas build --profile production
```

## 📱 Các câu lệnh chính

### **Version Management**

```bash
# Xem version hiện tại
npm run version show

# Tăng patch version (1.1.0 → 1.1.1) - cho OTA
npm run version update patch

# Tăng minor version (1.1.0 → 1.2.0) - cho store update
npm run version update minor

# Tăng major version (1.1.0 → 2.0.0) - cho major release
npm run version update major
```

### **OTA Updates**

```bash
# Deploy OTA update với message
npm run deploy-ota "Fix bug login"

# Deploy OTA update nhanh
npm run publish-ota

# Deploy OTA cho channel cụ thể
eas update --channel production --message "Update message"
eas update --channel preview --message "Test update"
```

### **Build Management**

```bash
# Build development app
npm run build-dev

# Build production app
eas build --profile production --platform android
eas build --profile production --platform ios

# Build preview app
eas build --profile preview --platform android
```

### **Monitoring & Debugging**

```bash
# Xem danh sách updates
eas update:list

# Xem chi tiết update
eas update:view <update-id>

# Xem danh sách builds
eas build:list

# Xem logs build
eas build:view <build-id>
```

## 🎯 Quy trình thực tế

### **Scenario 1: Fix bug nhỏ**
```bash
# 1. Sửa code
# 2. Test local
# 3. Deploy OTA
npm run deploy-ota "Fix crash khi login"
# 4. Khách hàng nhận update tự động
```

### **Scenario 2: Thêm tính năng mới**
```bash
# 1. Thêm tính năng
# 2. Tăng version
npm run version update minor
# 3. Build production
eas build --profile production
# 4. Submit store
# 5. Chờ approval
```

### **Scenario 3: Hotfix khẩn cấp**
```bash
# 1. Sửa bug khẩn cấp
# 2. Deploy OTA ngay
npm run deploy-ota "Hotfix: Fix crash critical"
# 3. Khách hàng nhận update trong 5-10 phút
```

## 📊 Version Strategy

### **Version Format: MAJOR.MINOR.PATCH**

```
1.0.9 → 1.1.0 (Minor: Thêm OTA) → Store Update
1.1.0 → 1.1.0 (Patch: Fix bug) → OTA Update
1.1.0 → 1.1.0 (Patch: UI improvement) → OTA Update
1.1.0 → 1.2.0 (Minor: Thêm chat) → Store Update
1.2.0 → 1.2.0 (Patch: Fix crash) → OTA Update
1.2.0 → 2.0.0 (Major: Redesign) → Store Update
```

### **Khi nào dùng gì:**

| Loại thay đổi | Version | Method | Thời gian |
|---------------|---------|--------|-----------|
| Bug fix nhỏ | Patch | OTA | 5-10 phút |
| UI improvement | Patch | OTA | 5-10 phút |
| Tính năng mới | Minor | Store | 1-7 ngày |
| Breaking changes | Major | Store | 1-7 ngày |

## 🔧 Troubleshooting

### **OTA không hoạt động**
```bash
# Kiểm tra cấu hình
eas update:configure

# Kiểm tra channel
eas update:list

# Kiểm tra build có hỗ trợ OTA không
eas build:list
```

### **Build lỗi**
```bash
# Clear cache
npx expo install --fix

# Kiểm tra JSON syntax
node -e "JSON.parse(require('fs').readFileSync('app.json'))"

# Rebuild
eas build --clear-cache
```

### **Version conflict**
```bash
# Kiểm tra version hiện tại
npm run version show

# Reset version nếu cần
npm run version update patch
```

## 📱 Channels

### **Development**
- **Channel**: `development-simulator`
- **Dùng cho**: Testing local

### **Preview**
- **Channel**: `preview`
- **Dùng cho**: Testing trước production

### **Production**
- **Channel**: `production`
- **Dùng cho**: Khách hàng thật

## 🚀 Best Practices

### **Trước khi deploy OTA:**
- [ ] Test kỹ lưỡng
- [ ] Không có console errors
- [ ] UI/UX hoạt động tốt
- [ ] Performance không bị ảnh hưởng

### **Khi deploy:**
- [ ] Dùng message rõ ràng
- [ ] Kiểm tra logs không có lỗi
- [ ] Xác nhận update đã publish

### **Sau khi deploy:**
- [ ] Monitor app hoạt động
- [ ] Kiểm tra feedback
- [ ] Theo dõi crash reports

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal
2. Xem documentation của Expo
3. Kiểm tra cấu hình trong `eas.json` và `app.json`
4. Contact team development

---

**Lưu ý**: OTA chỉ hoạt động với development, preview, hoặc production builds. Không hoạt động với standalone builds. 