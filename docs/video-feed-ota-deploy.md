# Video vuốt dọc — thay nút Kiến thức

## Chức năng

- Trang chủ: nút Video ở vị trí Kiến thức cũ. Giữ nguyên route và mã Kiến thức để bố trí lại sau.
- Route `/video`: danh sách vuốt dọc từng video, nút trước/sau, Shorts (mặc định) / Video / Đã lưu.
- Giữ tối đa 3 trình phát (hiện tại và 2 video liền kề) để giảm khởi tạo lại khi vuốt. Chỉ video hiện tại được phát; các video lân cận dừng và tắt tiếng. Dừng khi video không còn đủ hiển thị hoặc App xuống nền; rời màn hình sẽ hủy các trình phát.
- Giữ trình phát, điều khiển và nhận diện YouTube đầy đủ; nút lưu/mở YouTube nằm ngoài khung phát.
- Lưu video yêu thích trên điện thoại. Video thường ghi vị trí xem mỗi 5 giây khi đang phát, mở lại xem tiếp; Shorts bắt đầu từ đầu. Lưu tối đa 100 vị trí gần nhất. Dữ liệu này dùng chung trên thiết bị, chưa đồng bộ tài khoản/server.
- Shorts mặc định khung dọc, video thường mặc định khung ngang; đã bỏ nút đổi khung hình.
- Video lỗi/không cho nhúng có nút thử lại hoặc mở YouTube. Autoplay có thể cần người dùng chạm vào nút Play tùy thiết bị.

## Nguồn dữ liệu hiện tại

Dùng API `GET /videos` sẵn có với `video_url` và `video_title`. Không thêm backend, không tự đồng bộ từ kênh YouTube. Không tải file video từ YouTube về NAS/server.

App đọc được YouTube ID 11 ký tự, link watch, youtu.be, embed, live và shorts. Bỏ các bản ghi có link không hợp lệ và loại video trùng ID. Tab Shorts nhận diện URL có `/shorts/`; bản ghi chỉ lưu ID hoặc link watch xuất hiện trong tab Video, không suy đoán là Shorts.

Admin hiện gọi trường nhập là YouTube ID. Nếu nhập đầy đủ URL Shorts, App mới đọc được nhưng trình xem trước Admin cũ vẫn ghép `/embed/` với giá trị đó nên có thể không preview được. Bản này chưa sửa Admin. Các video nhập ID vẫn phát trong App với khung ngang; cần lưu URL Shorts để nhận diện khung dọc.

## File thêm/sửa lần này

- `components/home/FunctionItem.tsx`
- `screens/video/videos.screen.tsx`
- `components/video/FeedVideoCard.tsx` (mới)
- `utils/youtube.ts` (mới)
- `screens/video/playVideo.screen.tsx` (dùng chung bộ đọc link, bổ sung Shorts)
- `app/(routes)/_layout.tsx` (ẩn header cũ cho màn feed có header riêng)
- `lib/apiCall.ts` (timeout 15 giây cho lấy danh sách video)
- `tests/video-feed.test.cjs` (mới)
- Tài liệu này.

Không đổi package.json, lockfile, runtime, app version hoặc native. Chỉ cần OTA; không build APK mới, không upload App lên server, không migration hay restart PM2. Khi publish từ máy khác cần đồng bộ toàn bộ checkout, gồm các thay đổi chưa commit trước đó. EAS Update phát hành cả bundle App.

## Kiểm tra trên điện thoại

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx expo start --dev-client
```

Nếu Metro đang chạy thì reload App. Kiểm tra:

1. Trang chủ có Video thay Kiến thức; vào được màn feed.
2. Vuốt qua vài video; chỉ video đang xem phát âm thanh. Nếu thao tác trên trình YouTube giữ cử chỉ, vuốt ở vùng tiêu đề bên dưới hoặc dùng nút trước/sau.
3. Về Trang chủ, chuyển App xuống nền, khóa máy: video dừng.
4. Thử link Shorts và video thường, xác nhận Shorts khung dọc và video thường khung ngang, phát toàn màn hình và trở lại.
5. Lưu/bỏ lưu, xem mục Đã lưu, đóng/mở lại App để kiểm tra lưu trên máy.
6. Xem video thường hơn 10 giây, chuyển video rồi quay lại: tiếp tục gần vị trí đã lưu (sai lệch tối đa khoảng 5 giây).
7. Mất mạng hoặc video hạn chế nhúng: có thông báo và thử lại/mở YouTube.

TypeScript đạt; 33 bài kiểm tra tự động đạt (gồm 9 bài cho nguồn video, trạng thái phát, dữ liệu đã lưu và lỗi API). Các test dùng mock; cần kiểm tra phát YouTube và thao tác vuốt thực tế trên Android/iOS.

## Phát hành

Nếu có bản preview cùng runtime:

```powershell
npx eas-cli update --channel preview --environment preview --platform all --message "Add swipeable YouTube video feed"
```

Sau khi test trên máy thật đạt:

```powershell
npx eas-cli update --channel production --environment production --platform all --message "Add swipeable YouTube video feed"
```

Giữ runtime tương thích 1.3.0, kiểm tra biến môi trường đúng API. Người dùng mở App có mạng để tải cập nhật rồi đóng/mở lại để áp dụng. Chưa publish OTA trong lần chỉnh này.


## Sửa tab mặc định và toàn màn hình

Đã bỏ tab Tất cả; Shorts là tab mặc định, Video chỉ chứa video thường, Đã lưu vẫn có cả hai loại. Sửa ở `screens/video/videos.screen.tsx`, `components/video/FeedVideoCard.tsx`, `tests/video-feed.test.cjs`.

Nguyên nhân lỗi quay về video 1: effect đặt index/scrollOffset về 0 phụ thuộc size.height. Khi trình YouTube vào/thoát toàn màn hình, kích thước viewport thay đổi và kích hoạt reset. Nay chỉ reset khi danh sách/tab thay đổi; đổi kích thước căn lại offset theo video đang chọn. Trong fullscreen giữ nguyên viewport, khóa đổi video do viewability; thoát fullscreen đo lại viewport và căn lại vị trí. Test hồi quy mô phỏng chọn video thứ 2, resize và vào/thoát fullscreen đã đạt; cần xác nhận trên máy thật.

Test Android: mở video số 2/3 trong mỗi tab, mở toàn màn hình, đóng toàn màn hình và vuốt tiếp; số video và nội dung phải giữ nguyên. Thử lại sau khi khóa/mở máy.

Lệnh phát hành sau khi test đạt:

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx eas-cli update --channel production --environment production --platform all --message "Default to Shorts and preserve video in fullscreen"
```

Chỉ OTA, không cần file upload server, migration hay PM2. Chưa publish.


## Giảm chớp khi vuốt video

Sửa `screens/video/videos.screen.tsx` và `components/video/FeedVideoCard.tsx`: chuẩn bị sẵn trình phát liền trước/liền sau ở trạng thái pause + mute, dùng nền WebView tối từ lúc bắt đầu tải, không detach native WebView do clipping khi cuộn Android. Tối đa 3 trình phát, tránh tăng bộ nhớ theo toàn bộ danh sách. Không tải/cached file video YouTube về máy và không phát video ngoài màn hình. Có thể tăng một phần băng thông và bộ nhớ cho việc khởi tạo iframe lân cận.

Không đảm bảo hết buffering từ YouTube hoặc mạng chậm. Cần kiểm tra Android thực tế: chờ video đầu sẵn sàng, vuốt lần lượt tới video 2/3 và quay lại; không có hai âm thanh đồng thời; khóa máy và rời màn hình phải dừng. Thử vuốt nhanh và mở/đóng toàn màn hình để kiểm tra hồi quy. Không thay đổi hướng màn hình hay cấu hình native.

Lệnh OTA sau khi test đạt:

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx eas-cli update --channel production --environment production --platform all --message "Reduce video feed flicker with paused adjacent players"
```

Không cần upload file server/PM2/build APK. Chưa publish OTA.

## Shorts tối giản, mở rộng vùng xem

Ở tab Shorts đã bỏ toàn bộ phần nhãn, tiêu đề, Lưu video, Mở YouTube của App, header giới thiệu và footer số thứ tự/nút trước-sau. Trình phát dùng toàn bộ chiều cao còn lại dưới một hàng điều hướng gọn (quay lại + các tab). Không đặt overlay đè lên trình phát YouTube, không cắt hoặc che điều khiển/nhận diện YouTube. Tỷ lệ nội dung gốc được giữ nên có thể còn viền đen tùy video/màn hình. Tab Video và Đã lưu vẫn giữ thông tin/nút quản lý để có thể bỏ lưu video đã lưu trước đó.

File sửa: `components/video/FeedVideoCard.tsx`, `screens/video/videos.screen.tsx`. Chỉ OTA, không native/build/PM2. Reload Metro để kiểm tra tab Shorts lấp đầy vùng xem, vuốt video, vào/thoát fullscreen và chuyển qua tab Video/Đã lưu.

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx eas-cli update --channel production --environment production --platform all --message "Simplify Shorts with immersive video layout"
```

Chưa publish OTA.

## Xáo trộn Shorts mỗi lần vào

Thứ tự Shorts được xáo trộn khi mở màn video, quay lại màn video hoặc chuyển từ tab khác sang Shorts. Nếu có ít nhất 2 Shorts, video đầu tiên không trùng video đầu tiên lần trước. Lưu ID đầu tiên trên điện thoại cùng dữ liệu đã lưu, để áp dụng cả sau khi đóng/mở App. Chỉ 1 Shorts thì vẫn hiển thị video đó. Không tự xáo trộn trong lúc vuốt, resize hoặc mở toàn màn hình; tab Video/Đã lưu giữ thứ tự hiện có. Đây là đổi thứ tự nội dung đã có, không tự tạo hoặc lấy video mới từ kênh.

File sửa: `utils/youtube.ts`, `screens/video/videos.screen.tsx`, `tests/video-feed.test.cjs`, tài liệu này. TypeScript và 11 test video đạt. Reload Metro, mở Shorts vài lần và chuyển Video → Shorts để kiểm tra.

```powershell
cd D:\aliepenter_git\nhakhoathuyanhapp
npx eas-cli update --channel production --environment production --platform all --message "Shuffle Shorts on entry and avoid repeated first video"
```

Chỉ OTA, không cần upload server/PM2/build APK. Chưa publish.
