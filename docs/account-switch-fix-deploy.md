# Sửa lỗi mở Chuyển đổi tài khoản — 26/10/2026

## Nguyên nhân trong source

- Lockfile cài `@gorhom/bottom-sheet` 4.6.4 và `react-native-reanimated` 4.1.7. BottomSheet gọi `useWorkletCallback`, nhưng Reanimated 4 không export hàm đó. Mở nội dung sheet đi vào đường code không tương thích này. Tham khảo [thông tin phiên bản chính thức](https://github.com/gorhom/react-native-bottom-sheet).
- Màn hình đọc `item.avatar_id.value` trực tiếp. API `find-by-phone` trả avatar dưới dạng ID số hoặc null, không bảo đảm là object. Avatar null gây lỗi render; ID số tạo URL ảnh sai.
- Chưa thu crash log hoặc kiểm tra trên thiết bị thật; cần xác nhận sau khi cài bản sửa.

## Thay đổi

Popup dùng Modal React Native, giữ danh sách tài khoản cùng số điện thoại và đánh dấu tài khoản đang dùng. Chuẩn hóa dữ liệu danh sách, lấy avatar theo ID, dùng chữ cái tên nếu không có avatar. Không gọi cập nhật/reload khi chỉ mở popup. Khóa thao tác chuyển lặp, chỉ reload sau API xác nhận; lỗi reload được thông báo khác lỗi cập nhật tài khoản.

## File cần cập nhật

Chỉ project App `D:\aliepenter_git\nhakhoathuyanhapp`:

```text
screens/home/profile/profile.screen.tsx
components/profile/AccountSwitcher.tsx
```

Test đi kèm: `tests/account-switch.test.cjs`. Không cần tải App source lên server PM2. Không thay Admin, API, DB, dependency, app.json hoặc phiên bản native.

## Kiểm tra cục bộ

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
# Chỉ chạy nếu máy chưa có node_modules:
npm ci
node --test tests/account-switch.test.cjs
npx expo start --dev-client --clear
```

Dùng development build tương thích SDK 54 trên điện thoại. Kiểm tra mở/đóng popup nhiều lần; tài khoản thiếu avatar; nhiều tài khoản cùng số điện thoại; bấm chuyển liên tiếp; mất mạng; chọn tài khoản hiện tại; sau chuyển kiểm tra tên, hồ sơ và ảnh của tài khoản mới. Bản release phải kiểm tra thêm sau khi app reload.

## Deploy OTA

Source hiện cấu hình `expo.version = 1.3.0`, `runtimeVersion.policy = appVersion`; EAS có kênh `preview` và `production`. Bản sửa chỉ JavaScript, có thể dùng OTA cho bản cài cùng native runtime **1.3.0**. Không tăng appVersion chỉ để phát hotfix này. Nếu bản trên điện thoại dùng runtime khác, cần chuẩn bị bản sửa trên source tương thích với runtime đó hoặc build bản native mới; không đổi runtime để ép bundle mới vào binary cũ.

Chạy tại thư mục App:

```powershell
npx eas-cli login
npx eas-cli channel:view production
npx eas-cli update --channel preview --environment preview --platform all --message "Fix account switch popup crash"
```

Cài bản preview cùng runtime để kiểm tra. Nếu chưa có preview build:

```powershell
npx eas-cli build --profile preview --platform all
```

Sau khi kiểm tra trên điện thoại đạt, phát production:

```powershell
npx eas-cli update --channel production --environment production --platform all --message "Fix account switch popup crash"
```

Lệnh update sẽ xuất bundle và publish OTA lên Expo, không cần `pm2 restart`. App hiện tải OTA ngầm: mở app có mạng, chờ tải xong rồi đóng hẳn/mở lại để áp dụng. Theo [tài liệu Expo](https://docs.expo.dev/eas-update/runtime-versions/), update và binary cần khớp runtime và channel.

## Kiểm thử đã thực hiện

- 6 test regression (mock React Native): avatar thiếu/ID số, mở popup không chuyển/reload, chặn bấm lặp, API lỗi/hết phiên, dữ liệu sai, reload thất bại sau khi chuyển.
- Xuất bundle Android/iOS bằng Expo để kiểm tra bundling; không phát OTA hoặc gọi API thật để chuyển tài khoản.
- TypeScript toàn project còn lỗi ngoài phần sửa: màn hình thông báo dùng type/prop cũ của TabView; màn hình hợp đồng dùng `documentDirectory` cũ; kiểu trạng thái yêu cầu đổi lịch hẹn. Hai file sửa không có diagnostic TypeScript.
