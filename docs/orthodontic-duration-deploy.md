# Dừng bộ đếm niềng răng tại ngày kết thúc

## File cập nhật trong App

- `utils/orthodonticDuration.ts` (mới): tính số ngày theo ngày lịch Việt Nam.
- `types/global.d.ts`: bổ sung trạng thái và ngày kết thúc nhận từ API.
- `screens/home/home.screen.tsx`: dùng ngày kết thúc và tải lại hồ sơ khi quay về hoặc kéo làm mới.
- `components/home/TimeTracking.tsx`: hiển thị số ngày và mốc kết thúc; thiếu dữ liệu hiển thị rõ thay vì quay vô hạn.
- `screens/loving/loving.screen.tsx`: bộ đếm và ảnh chia sẻ dùng cùng quy tắc, thêm ngày kết thúc.
- `tests/orthodontic-duration.test.cjs`: kiểm thử hồi quy (không cần đưa vào bản chạy).

Theo dõi duy trì, Đã hoàn tất, Ngừng điều trị: tính từ ngay_gan_mc đến orthodontic_ended_on.
Đang điều trị hoặc hồ sơ cũ chưa có trạng thái: tính đến hôm nay.
Mở lại điều trị: tiếp tục tính từ ngày gắn mắc cài đến hôm nay, không trừ thời gian tạm dừng.
Thiếu/sai ngày kết thúc thì không tự dùng hôm nay thay thế. Cần sửa dữ liệu trên Admin.
Ví dụ gắn mắc cài 01/11/2024, kết thúc 01/11/2025: 365 ngày, không cộng thêm 1 ngày.

API /auth/profile hiện trả về các trường mới sau đợt cập nhật API/Admin. Không cần migration hay restart PM2 cho lần sửa App này.

## Kiểm tra

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
node --test tests/orthodontic-duration.test.cjs tests/account-switch.test.cjs
npx tsc --noEmit --incremental false
npx expo start --dev-client
```

Trong App, kéo làm mới trang chủ sau khi sửa trạng thái trên Admin. Kiểm tra số ngày trên trang chủ và màn hình Đồng hành cùng nhau giống nhau;
cùng dừng tại 01/11/2025, ảnh chia sẻ cũng hiển thị ngày đó. Mở lại điều trị trên Admin và kéo làm mới: bộ đếm tiếp tục đến hôm nay.
Kiểm tra chuyển giữa hai hồ sơ cùng số điện thoại để đảm bảo mỗi hồ sơ dùng ngày riêng.

## OTA

Đã kiểm tra: 18 test qua, TypeScript toàn dự án qua, Expo export Android và iOS thành công.
Chưa kiểm tra trực tiếp trên điện thoại với hồ sơ bệnh nhân thật.

Đây là thay đổi TypeScript/giao diện; không đổi native, dependency hoặc app.json.
Cấu hình hiện tại: appVersion 1.3.0, runtimeVersion theo appVersion, channel production/preview trong eas.json.
OTA chỉ áp dụng cho bản cài có runtime tương thích và channel tương ứng.
Không tăng version để phát hành bản sửa này cho runtime 1.3.0 hiện có.

Sau khi kiểm tra trên thiết bị, có thể phát hành preview (nếu có bản cài preview tương thích):

```powershell
npx eas-cli update --channel preview --environment preview --platform all --message "Stop orthodontic duration at treatment end date"
```

Khi đã xác nhận, phát hành production:

```powershell
npx eas-cli update --channel production --environment production --platform all --message "Stop orthodontic duration at treatment end date"
```

Không dùng FileZilla để đưa source App lên server Admin/API. Nếu build/publish trên máy khác, đồng bộ checkout App đầy đủ:
checkout đang có các cập nhật khác chưa commit, OTA sẽ gồm toàn bộ chúng, không chỉ các file của lần sửa này.
Kiểm tra environment của EAS trỏ đúng API trước khi phát hành. Bản dev đang dùng Metro nhận mã trên máy;
bản production tải OTA qua mạng và áp dụng theo cơ chế expo-updates khi mở lại App.
Chưa chạy lệnh publish trong lần sửa này.
