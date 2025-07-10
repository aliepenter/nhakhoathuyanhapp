# Version Update Popup

## Tổng quan

Popup thông báo phiên bản mới là một component được thiết kế để thông báo cho người dùng khi có phiên bản mới của ứng dụng. Thay vì chỉ hiển thị một đoạn text đơn giản, popup này cung cấp trải nghiệm người dùng tốt hơn với:

- Design đẹp và sang trọng
- Animation mượt mà
- Haptic feedback
- Quản lý trạng thái thông minh

## Tính năng

### 🎨 Design & UX
- **Gradient background**: Sử dụng gradient từ xanh lá (#4FAA57) đến xanh dương (#1560A1)
- **Animation**: Popup xuất hiện với hiệu ứng scale, slide và fade
- **Icon animation**: Icon download xoay liên tục để thu hút sự chú ý
- **Haptic feedback**: Rung nhẹ khi hiển thị popup và khi tương tác

### 🧠 Logic thông minh
- **Kiểm tra phiên bản**: Tự động kiểm tra phiên bản mới từ API
- **Lưu trạng thái**: Sử dụng AsyncStorage để lưu trạng thái đã hiển thị popup
- **Hiển thị một lần**: Popup chỉ hiển thị một lần cho mỗi phiên bản mới
- **Tự động cập nhật**: Khi có phiên bản mới, popup sẽ hiển thị lại

### 📱 Responsive
- **Adaptive width**: Popup tự động điều chỉnh kích thước theo màn hình
- **Cross-platform**: Hoạt động tốt trên cả iOS và Android
- **Status bar**: Tự động xử lý status bar

## Cách sử dụng

### 1. Import components và hooks

```typescript
import VersionUpdatePopup from '@/components/home/VersionUpdatePopup';
import { useVersionUpdate } from '@/hooks/useVersionUpdate';
```

### 2. Sử dụng trong component

```typescript
const MyComponent = () => {
  const { showPopup, newVersion, closePopup } = useVersionUpdate();

  const handleUpdateApp = () => {
    const url = Platform.OS === 'android'
      ? 'market://details?id=com.anonymous.nhakhoathuyanh'
      : 'https://apps.apple.com/us/app/my-braces-ni%E1%BB%81ng-r%C4%83ng-th%C3%B9y-anh/id6743517132';

    Linking.openURL(url)
      .catch(err => console.error('Failed to open app:', err));
  };

  return (
    <View>
      {/* Your app content */}
      
      <VersionUpdatePopup
        visible={showPopup}
        version={newVersion || ''}
        onClose={closePopup}
        onUpdate={handleUpdateApp}
      />
    </View>
  );
};
```

## Props

### VersionUpdatePopup

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | `boolean` | ✅ | Trạng thái hiển thị popup |
| `version` | `string` | ✅ | Số phiên bản mới |
| `onClose` | `() => void` | ✅ | Callback khi đóng popup |
| `onUpdate` | `() => void` | ✅ | Callback khi nhấn nút cập nhật |

### useVersionUpdate Hook

| Property | Type | Description |
|----------|------|-------------|
| `showPopup` | `boolean` | Trạng thái hiển thị popup |
| `newVersion` | `string \| null` | Số phiên bản mới |
| `isChecking` | `boolean` | Trạng thái đang kiểm tra |
| `closePopup` | `() => void` | Hàm đóng popup |
| `checkForUpdate` | `() => Promise<void>` | Hàm kiểm tra cập nhật |
| `resetVersionCheck` | `() => Promise<void>` | Hàm reset trạng thái |

## Customization

### Thay đổi màu sắc

```typescript
// Trong VersionUpdatePopup.tsx
<LinearGradient
  colors={['#YOUR_COLOR_1', '#YOUR_COLOR_2']} // Thay đổi màu gradient
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientBackground}
>
```

### Thay đổi nội dung

```typescript
// Thay đổi text trong popup
<Text style={styles.title}>Your Custom Title</Text>
<Text style={styles.description}>Your custom description</Text>
```

### Thay đổi animation

```typescript
// Điều chỉnh thời gian animation
Animated.timing(opacityAnim, {
  toValue: 1,
  duration: 300, // Thay đổi thời gian
  useNativeDriver: true,
}),
```

## Storage Keys

Hook sử dụng các key sau trong AsyncStorage:

- `version_popup_shown`: Lưu phiên bản đã hiển thị popup
- `last_version_checked`: Lưu phiên bản đã kiểm tra cuối cùng

## Lưu ý

1. **API Endpoint**: Cần có API endpoint `/versions/latest-version` trả về thông tin phiên bản mới
2. **Permissions**: Cần quyền truy cập internet để kiểm tra phiên bản
3. **App Store Links**: Cần cập nhật link App Store và Google Play Store phù hợp
4. **Testing**: Có thể sử dụng `resetVersionCheck()` để test popup

## Troubleshooting

### Popup không hiển thị
- Kiểm tra API endpoint có hoạt động không
- Kiểm tra phiên bản hiện tại trong `app.json`
- Sử dụng `resetVersionCheck()` để reset trạng thái

### Animation không mượt
- Đảm bảo `useNativeDriver: true` được set
- Kiểm tra performance trên thiết bị thật

### Haptic feedback không hoạt động
- Chỉ hoạt động trên thiết bị thật, không hoạt động trên simulator
- Kiểm tra quyền haptic feedback 