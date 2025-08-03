# 🧪 Hướng dẫn Test OTA Updates

## Bước 1: Chuẩn bị

### 1.1 Kiểm tra cấu hình
```bash
npm run test-ota
```

### 1.2 Đăng nhập EAS (nếu chưa)
```bash
eas login
```

### 1.3 Cấu hình project (nếu cần)
```bash
eas build:configure
```

## Bước 2: Build Development App

### 2.1 Build cho Android
```bash
npm run build-dev
```

### 2.2 Hoặc build thủ công
```bash
eas build --profile development --platform android
```

### 2.3 Tải và cài đặt app
- Tải xuống file .apk từ link EAS cung cấp
- Cài đặt trên device Android
- Mở app và đăng nhập

## Bước 3: Test OTA Updates

### 3.1 Thay đổi code để test
Ví dụ: Thay đổi text trong component

```tsx
// Thay đổi trong components/test/OTATestComponent.tsx
<Text style={styles.title}>🧪 OTA Update Test v2</Text>
```

### 3.2 Publish OTA Update
```bash
npm run publish-ota
```

### 3.3 Test trên device
1. Mở app trên device
2. Đi đến màn hình test (nếu có)
3. Kiểm tra popup update có hiển thị không
4. Nhấn "Cập nhật tự động"
5. Quan sát progress bar và app reload

## Bước 4: Test Scenarios

### 4.1 Test cơ bản
- ✅ App hiển thị popup update
- ✅ Progress bar hoạt động
- ✅ App reload sau update
- ✅ Thay đổi code được áp dụng

### 4.2 Test lỗi
- ❌ Không có internet
- ❌ Update fail
- ❌ App crash sau update

### 4.3 Test edge cases
- 🔄 Update khi app đang sử dụng
- 🔄 Update khi có nhiều màn hình mở
- 🔄 Update khi có data chưa lưu

## Bước 5: Debug và Troubleshooting

### 5.1 Kiểm tra logs
```bash
# Xem logs trong console
adb logcat | grep "ExpoUpdates"

# Hoặc trong app
console.log('OTA Update logs:', updateInfo);
```

### 5.2 Kiểm tra update status
```bash
# Xem danh sách updates
eas update:list

# Xem chi tiết update
eas update:view [UPDATE_ID]
```

### 5.3 Rollback nếu cần
```bash
# Rollback về version trước
eas update:rollback

# Hoặc delete update
eas update:delete [UPDATE_ID]
```

## Bước 6: Test với Component Test

### 6.1 Thêm component test vào app
```tsx
// Trong màn hình nào đó
import OTATestComponent from '@/components/test/OTATestComponent';

// Thêm vào render
<OTATestComponent />
```

### 6.2 Sử dụng component test
- Nhấn "🔍 Kiểm tra Update" để test check update
- Nhấn "🔄 Test Update" để test perform update
- Quan sát thông tin hiển thị

## Lưu ý quan trọng

### ⚠️ Những gì cần lưu ý:
1. **Development build only**: OTA chỉ hoạt động trên development build, không hoạt động trên Expo Go
2. **Internet required**: Cần internet để download update
3. **Storage space**: Đảm bảo device có đủ dung lượng
4. **Battery**: Nên test khi pin đầy
5. **Stable connection**: Kết nối internet ổn định

### 🔧 Troubleshooting phổ biến:

#### Lỗi: "Update không hiển thị"
```bash
# Kiểm tra internet
ping google.com

# Kiểm tra EAS project
eas project:info

# Kiểm tra update list
eas update:list
```

#### Lỗi: "Update fail"
```bash
# Kiểm tra storage
adb shell df

# Kiểm tra logs
adb logcat | grep "ExpoUpdates"

# Restart app
adb shell am force-stop com.anonymous.nhakhoathuyanh
```

#### Lỗi: "App crash sau update"
```bash
# Rollback ngay lập tức
eas update:rollback

# Kiểm tra crash logs
adb logcat | grep "FATAL"
```

## Best Practices cho Testing

### 1. Test Environment
- ✅ Sử dụng device thật (không phải emulator)
- ✅ Test trên nhiều Android versions
- ✅ Test với các kết nối internet khác nhau

### 2. Test Data
- ✅ Backup data trước khi test
- ✅ Test với data thật
- ✅ Test với app state khác nhau

### 3. Test Timing
- ✅ Test vào giờ thấp điểm
- ✅ Test với nhiều user cùng lúc
- ✅ Test với update size khác nhau

### 4. Monitoring
- ✅ Track update success rate
- ✅ Monitor crash reports
- ✅ Collect user feedback

## Commands hữu ích

```bash
# Test cấu hình
npm run test-ota

# Build development app
npm run build-dev

# Publish OTA update
npm run publish-ota

# Kiểm tra updates
eas update:list

# Rollback update
eas update:rollback

# Xem project info
eas project:info

# Login/logout EAS
eas login
eas logout
```

## Support

Nếu gặp vấn đề:
1. Kiểm tra [Expo Updates Docs](https://docs.expo.dev/versions/latest/sdk/updates/)
2. Kiểm tra [EAS Docs](https://docs.expo.dev/eas/)
3. Tìm kiếm trên [Expo Forums](https://forums.expo.dev/)
4. Liên hệ team development 