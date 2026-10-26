# Thống kê hoạt động App — OTA

## Cách hoạt động

- Một tracker dùng chung tại root App, chỉ Android/iOS.
- Gửi heartbeat khi App foreground và có token đăng nhập; tiếp tục mỗi 60 giây.
- Điều hướng kiểm tra token mới nhưng không gửi trùng liên tục. Chuyển hồ sơ được server nhận biết ở heartbeat tiếp theo (hoặc ngay khi App reload sau chuyển tài khoản).
- Background/unmount hủy request đang chờ và không gửi heartbeat; không chạy background task.
- Request timeout 5 giây. API chưa có, mất mạng, token hết hạn hoặc server lỗi đều không gây popup/crash; thử lại ở nhịp sau, không lưu/replay sự kiện offline.
- Dev qua Metro và các channel khác production được đánh dấu is_development=true để backend tách khỏi số liệu thật. Không thu thập vị trí, nội dung hồ sơ, số điện thoại hoặc ID thiết bị trong payload.

## Hợp đồng đã đối chiếu với chat Admin + Api Mybrace

POST `${SERVER_URI}/app-activity/heartbeat`, Bearer token hiện tại:

```json
{"platform":"android","app_version":"1.3.0","is_development":false}
```

Server tự xác định nhóm đăng nhập/hồ sơ đang chọn và thời gian. Online là ước tính theo heartbeat 180 giây gần nhất, nên sau đóng App/đăng xuất có thể còn hiển thị online tối đa khoảng 3 phút. Không phải số người thật tuyệt đối: nhiều người dùng chung số điện thoại vẫn là một nhóm đăng nhập. Chỉ thống kê các bản App đã nhận mã mới. Không khôi phục lịch sử sử dụng trước triển khai.

Hợp đồng API: `D:\aliepenter_git\nhakhoathuyanhapi\docs\app-activity-api-contract.md`.

## File App thay đổi

- Thêm `lib/appActivity.ts`.
- Thêm `hooks/useAppActivity.ts`.
- Sửa `app/_layout.tsx` để mount hook đúng một lần.
- Thêm `tests/app-activity.test.cjs` và tài liệu này.

Không thay đổi dependencies, runtime, phiên bản 1.3.0 hoặc cấu hình native. Chỉ cần OTA. Không upload file App lên server, không chạy PM2 cho App. Nếu publish từ máy khác, đồng bộ toàn bộ checkout bao gồm các thay đổi chưa commit trước đó; EAS Update không phát hành riêng từng file.

## Kiểm tra và phát hành

1. Deploy migration/API/Admin theo hướng dẫn trong chat Admin + Api Mybrace trước. Chat đó xử lý PM2 `adminApi` và `admin`.
2. Trên máy dev:

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx tsc --noEmit --pretty false
node --test tests/*.test.cjs
npx expo start --dev-client
```

Nếu Metro đang chạy, reload App. Đăng nhập, giữ App mở hơn 60 giây: kiểm tra dữ liệu dev trong Admin. Xuống nền/khóa máy hơn 3 phút: không còn online. Mở lại: heartbeat mới. Thử đăng xuất, đổi tài khoản, mất mạng; UI vẫn hoạt động như trước. Không dùng số liệu dev để đánh giá số người dùng production.

3. Nếu có bản preview cùng runtime:

```powershell
npx eas-cli update --channel preview --environment preview --platform all --message "Add foreground app activity tracking"
```

4. Sau khi test tích hợp đạt và backend đã sẵn sàng:

```powershell
npx eas-cli update --channel production --environment production --platform all --message "Add foreground app activity tracking"
```

Kiểm tra SERVER_URI của môi trường phát hành trỏ đúng backend đã deploy. Chỉ bản native tương thích cùng runtime/channel nhận được OTA; người dùng mở App có mạng để tải rồi đóng và mở lại để áp dụng.

Chưa publish OTA hoặc phát sinh heartbeat thử nghiệm lên server thật trong lần chỉnh này. Test tự động dùng mock; cần kiểm tra tích hợp sau deploy API.
