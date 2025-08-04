# Changelog

## [1.2.0] - 2024-12-19

### 🐛 Fixed
- **Android Camera Permissions**: Fixed Google Play Store rejection by removing media permissions and using Photo Picker API
- **Camera Layout**: Fixed camera screen layout issues on Android devices
- **Avatar Upload**: Improved avatar upload with immediate visual feedback and better cache busting
- **Image Picker**: Updated to use new `"images"` media type instead of deprecated `MediaTypeOptions.Images`

### 🔧 Technical Changes
- Removed `expo-media-library` dependency
- Updated Android permissions to only include necessary ones:
  - `android.permission.CAMERA`
  - `android.permission.INTERNET`
  - `android.permission.RECORD_AUDIO`
- Added Photo Picker configuration for Android
- Improved error handling for camera and avatar uploads
- Added loading states and better UX for upload processes

### 📱 Platform Specific
- **Android**: Fixed camera layout and permissions compliance
- **iOS**: Improved avatar upload performance
- **Both**: Enhanced error handling and user feedback

### 🚀 Performance
- Faster avatar upload with immediate local preview
- Better cache management for images
- Improved camera initialization on Android

---

## [1.1.0] - Previous Version
- Initial release with basic functionality
- Camera and avatar features
- Basic UI and navigation 