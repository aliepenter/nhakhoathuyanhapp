# Tối ưu loading, sửa TypeScript và bỏ chi tiết hợp đồng — OTA

Đã bỏ thời gian chờ nhân tạo ở 22 file màn hình/hook; loading kết thúc khi có kết quả. Giữ các timer camera, bàn phím, modal và chống bấm liên tục. Luồng tải lại hồ sơ trả góp chờ tải xong lịch sử của hồ sơ mới, không gọi lại bằng hồ sơ cũ. Bật LogBox khi __DEV__. Loại bỏ renderTabBar không được sử dụng và sửa kiểu dữ liệu lịch hẹn. Không cập nhật dependencies, app version, runtime hoặc native.

## File sửa trong lần này

- `screens/auth/verify/password.screen.tsx`
- `screens/branches/branches.screen.tsx`
- `screens/chinh-nha/chinhNha.screen.tsx`
- `screens/chinh-nha/chinhNhaDetail.screen.tsx`
- `screens/home/home.screen.tsx`
- `screens/home/image-gallery/myGallery.screen.tsx`
- `screens/home/image-gallery/quaTrinh.screen.tsx`
- `screens/home/notification/khuyenMai.screen.tsx`
- `screens/home/notification/troChuyen.screen.tsx`
- `screens/home/profile/aboutUs.screen.tsx`
- `screens/home/profile/changePassword.screen.tsx`
- `screens/home/profile/faq.screen.tsx`
- `screens/hop-dong/hopDong.screen.tsx`
- `screens/loi-dan/kienThucBaiViet.screen.tsx`
- `screens/loi-dan/kienThucVideo.tsx`
- `screens/loi-dan/loiDan.screen.tsx`
- `screens/payment/dichVuKhac.screen.tsx`
- `screens/payment/hoSoTraGopCn.screen.tsx`
- `screens/tin-tuc/tinTuc.screen.tsx`
- `screens/tin-tuc/tinTucAll.screen.tsx`
- `screens/video/videos.screen.tsx`
- `hooks/auth/useUser.tsx`
- `app/_layout.tsx`
- `app/(routes)/_layout.tsx`
- `screens/home/notification/notification.screen.tsx`
- `screens/lich-hen/lichHen.screen.tsx`
- `tests/account-switch.test.cjs`

## File đã bỏ

- `screens/hop-dong/hopDongDetail.screen.tsx`
- `app/(routes)/hop-dong/hopDongDetail.tsx`

Đã bỏ khai báo route tương ứng. Màn danh sách hợp đồng mở link trực tiếp được giữ nguyên. Link trực tiếp đến route chi tiết cũ sẽ không còn hoạt động.

## Kiểm tra

- `npx tsc --noEmit --pretty false`: đạt, không còn 6 lỗi TypeScript đã báo trước đó.
- `node --test tests/account-switch.test.cjs`: 12/12 đạt, gồm kiểm tra loading chờ API và kết thúc ngay khi API thành công hoặc lỗi.
- Export Android/iOS thành công.
- Chưa thao tác trực tiếp trên điện thoại và chưa publish OTA.

## Test và deploy

Không cần upload file lên server Admin/API, không cần PM2 hay migration. Nếu dùng máy khác để publish, đồng bộ toàn bộ checkout hiện tại (bao gồm các thay đổi chưa commit từ lần trước và file AccountSwitcher), áp dụng cả hai file bị xóa. EAS Update đóng gói toàn bộ App.

Trên máy này:

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx expo start --dev-client
```

Nếu Metro đang chạy, chỉ reload App. Kiểm tra đăng nhập thành công/sai mật khẩu, Trang chủ, Ảnh quá trình, Lịch hẹn, Tin tức, Thanh toán và kéo để tải lại; thử mạng chậm/mất mạng. Cảnh báo khi dev sẽ hiện lại.

Nếu có bản preview đúng runtime, phát hành thử:

```powershell
npx eas-cli update --channel preview --environment preview --platform all --message "Improve loading and clean up legacy screens"
```

Sau khi test đạt, phát hành production:

```powershell
npx eas-cli update --channel production --environment production --platform all --message "Improve loading and clean up legacy screens"
```

Giữ runtime 1.3.0, chỉ phát hành cho bản native tương thích cùng runtime/channel. Kiểm tra biến môi trường đúng môi trường phát hành. Bản development chạy Metro không nhận mã production qua lệnh này. Người dùng production mở App có mạng để tải cập nhật, sau đó đóng hẳn và mở lại để áp dụng.
