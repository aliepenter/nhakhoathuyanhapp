# ✅ Deployment Checklist

## 🔄 OTA Update Checklist

### **Trước khi deploy:**
- [ ] Code đã được test kỹ lưỡng
- [ ] Không có console errors
- [ ] UI/UX hoạt động tốt
- [ ] Performance không bị ảnh hưởng
- [ ] Đã commit và push code
- [ ] Message rõ ràng cho update

### **Khi deploy:**
- [ ] Chạy `npm run deploy-ota "Message"`
- [ ] Kiểm tra log không có lỗi
- [ ] Xác nhận update đã được publish
- [ ] Ghi lại update ID

### **Sau khi deploy:**
- [ ] Monitor app hoạt động bình thường
- [ ] Kiểm tra feedback từ khách hàng
- [ ] Theo dõi crash reports (nếu có)
- [ ] Cập nhật changelog

## 🏪 Store Update Checklist

### **Trước khi build:**
- [ ] Code đã được test kỹ lưỡng
- [ ] Tăng version: `npm run version update minor`
- [ ] Cập nhật changelog
- [ ] Test trên development build
- [ ] Đã commit và push code

### **Khi build:**
- [ ] Chạy `eas build --profile production`
- [ ] Kiểm tra build thành công
- [ ] Download và test AAB/APK
- [ ] Submit lên store

### **Sau khi submit:**
- [ ] Theo dõi review process
- [ ] Chuẩn bị rollback plan
- [ ] Thông báo cho team
- [ ] Monitor sau khi release

## 🚨 Emergency Hotfix Checklist

### **Khi có bug critical:**
- [ ] Xác định mức độ nghiêm trọng
- [ ] Sửa bug ngay lập tức
- [ ] Test nhanh nhưng kỹ
- [ ] Deploy OTA: `npm run deploy-ota "Hotfix: Critical bug"`
- [ ] Thông báo cho team
- [ ] Monitor 24/7

### **Nếu OTA không đủ:**
- [ ] Đánh giá cần store update
- [ ] Tăng version: `npm run version update patch`
- [ ] Build production: `eas build --profile production`
- [ ] Submit store khẩn cấp
- [ ] Thông báo cho khách hàng

## 📊 Monitoring Checklist

### **Hàng ngày:**
- [ ] Kiểm tra crash reports
- [ ] Xem user feedback
- [ ] Monitor performance metrics
- [ ] Kiểm tra update success rate

### **Hàng tuần:**
- [ ] Review analytics
- [ ] Cập nhật roadmap
- [ ] Plan next release
- [ ] Team retrospective

## 🔧 Troubleshooting Checklist

### **OTA không hoạt động:**
- [ ] Kiểm tra internet connection
- [ ] Kiểm tra channel configuration
- [ ] Kiểm tra build có hỗ trợ OTA
- [ ] Test trên device khác
- [ ] Clear app cache

### **Build lỗi:**
- [ ] Kiểm tra JSON syntax
- [ ] Clear cache: `npx expo install --fix`
- [ ] Kiểm tra dependencies
- [ ] Rebuild với clear cache
- [ ] Kiểm tra EAS configuration

### **App crash:**
- [ ] Kiểm tra crash logs
- [ ] Rollback nếu cần
- [ ] Fix bug
- [ ] Deploy hotfix
- [ ] Thông báo cho users

## 📱 Version Strategy Checklist

### **Patch (1.1.0 → 1.1.1):**
- [ ] Bug fixes nhỏ
- [ ] UI improvements
- [ ] Performance optimizations
- [ ] Deploy via OTA

### **Minor (1.1.0 → 1.2.0):**
- [ ] Tính năng mới
- [ ] UI changes lớn
- [ ] New screens/pages
- [ ] Deploy via store

### **Major (1.1.0 → 2.0.0):**
- [ ] Breaking changes
- [ ] Redesign lớn
- [ ] Architecture changes
- [ ] Deploy via store

## 🎯 Success Metrics

### **OTA Success:**
- [ ] Update success rate > 95%
- [ ] No critical crashes
- [ ] Positive user feedback
- [ ] Performance maintained

### **Store Success:**
- [ ] Approval time < 7 days
- [ ] No rejection
- [ ] Positive reviews
- [ ] Download increase

---

**Lưu ý**: Luôn backup trước khi deploy và có rollback plan sẵn sàng. 