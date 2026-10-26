# Ảnh quá trình và đăng xuất — OTA

## File thay đổi

- `screens/home/image-gallery/quaTrinhDetail.screen.tsx`: bỏ ảnh thiếu khỏi nút chọn và danh sách phóng to, giữ đúng biểu tượng/vị trí; hiển thị trạng thái album rỗng.
- `screens/home/profile/profile.screen.tsx`: vẫn đăng xuất trên máy nếu xóa token thông báo lỗi.
- `lib/apiCall.ts`: giới hạn API xóa token thông báo ở 5 giây.
- `tests/account-switch.test.cjs`: kiểm tra hồi quy ảnh và đăng xuất.

Giữ nguyên phiên bản 1.3.0, runtime, dependencies và cấu hình native. Chỉ cần OTA cho bản cài có native tương thích, đúng runtime và channel. Không upload lên máy chủ Admin/API, không restart PM2, không migration.

Nếu phát hành từ máy khác, đồng bộ toàn bộ checkout hiện tại; đặc biệt phải có `components/profile/AccountSwitcher.tsx` từ lần sửa trước vì profile đang import file đó. EAS Update đóng gói toàn bộ App, không chỉ ba file vừa sửa. Không upload riêng các file TSX lên server.

## Test Android qua Metro

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx expo start --dev-client
```

Nếu Metro đang chạy thì reload App. Kiểm tra hồ sơ 7 ảnh, 11 ảnh không X-quang, 13 ảnh; chọn và phóng to từng ảnh, xem album rỗng. Đăng nhập, vào Tài khoản, tắt mạng rồi đăng xuất: phải về trang đăng nhập dù API thông báo lỗi. Bật mạng và đăng nhập lại; kiểm tra chuyển tài khoản.

Nếu xóa token thông báo trên server thất bại, token đó có thể còn lưu trên server; thay đổi này đảm bảo xóa phiên đăng nhập cục bộ, không khẳng định đã gỡ đăng ký push trên server.

## Kiểm tra tự động

```powershell
node --test tests/account-switch.test.cjs
```

11 bài kiểm tra đạt. TypeScript toàn dự án còn 6 lỗi có sẵn ở Thông báo, Chi tiết hợp đồng và Lịch hẹn, ngoài phạm vi lần sửa này.

Export Android và iOS thành công. Export thêm nền tảng web không thành công do thiếu `@lottiefiles/dotlottie-react`; không thay đổi dependency vì đợt này chỉ phát hành App mobile qua OTA.

## Phát hành OTA

Sau khi test trên Android, phát hành lên preview nếu có bản cài channel preview cùng runtime:

```powershell
npx eas-cli update --channel preview --environment preview --platform all --message "Fix optional progress photos and offline logout"
```

Khi đã xác nhận, phát hành cho người dùng production:

```powershell
npx eas-cli update --channel production --environment production --platform all --message "Fix optional progress photos and offline logout"
```

Kiểm tra biến môi trường của từng môi trường trước khi phát hành. Bản development đang kết nối Metro dùng mã trên máy, không tự chuyển sang nhận OTA production. Người dùng bản production mở App có mạng để tải OTA, sau đó đóng hẳn và mở lại để áp dụng theo cơ chế cập nhật hiện tại. Các lệnh trên là hướng dẫn; chưa được chạy để publish trong lần sửa này.
