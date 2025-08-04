# Android Permissions Fix - Google Play Store Compliance

## Vấn đề
Ứng dụng bị Google Play Store từ chối với lỗi:
> "Photo and Video Permissions policy: Permission use is not directly related to your app's core purpose. Your app only requires one-time or infrequent access to media files on the device."

## Nguyên nhân
- Sử dụng `expo-media-library` để lưu ảnh vào thư viện
- Sử dụng các quyền `READ_EXTERNAL_STORAGE` và `WRITE_EXTERNAL_STORAGE`
- Google Play Store yêu cầu sử dụng Android Photo Picker API thay vì các quyền truy cập media

## Giải pháp đã thực hiện

### 1. Loại bỏ expo-media-library
- Xóa `expo-media-library` khỏi `package.json`
- Xóa cấu hình `expo-media-library` trong `app.json`
- Thay thế bằng `expo-file-system` và `Share` API

### 2. Cập nhật quyền Android
Trong `app.json`, chỉ giữ lại các quyền cần thiết:
```json
"permissions": [
  "android.permission.CAMERA",
  "android.permission.INTERNET", 
  "android.permission.RECORD_AUDIO"
]
```

### 3. Cấu hình Photo Picker
Cập nhật `expo-image-picker` để sử dụng Android Photo Picker API:
```json
[
  "expo-image-picker",
  {
    "photosPermission": "The app accesses your photos to let you share them with your friends.",
    "android": {
      "usePhotoPicker": true
    }
  }
]
```

### 4. Thay đổi cách lưu ảnh
Thay vì lưu trực tiếp vào thư viện, sử dụng:
- `expo-file-system` để lưu ảnh vào Documents directory
- `Share` API để cho phép người dùng chia sẻ/lưu ảnh

### 5. Cập nhật UI
- Thay đổi text từ "Tải về máy" thành "Chia sẻ ảnh"
- Sử dụng Share API thay vì MediaLibrary

## Lợi ích
- Tuân thủ Google Play Store policies
- Không cần quyền truy cập media
- Người dùng có quyền kiểm soát hoàn toàn việc lưu ảnh
- Tương thích với Android 13+ (API 33+)

## Testing
1. Test chức năng chụp ảnh
2. Test chức năng chọn ảnh từ thư viện
3. Test chức năng chia sẻ ảnh
4. Verify không có quyền media trong APK

## Build và Deploy
```bash
# Clean install
npm install

# Build cho Android
eas build --platform android

# Submit lên Google Play Store
eas submit --platform android
``` 