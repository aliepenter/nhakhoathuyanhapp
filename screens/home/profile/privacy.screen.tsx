import { View, Text, ScrollView } from 'react-native'
import React from 'react'

export default function PrivacyScreen() {
  return (
    <View className='h-full bg-[#F2F1F6] px-[19px]'>
      <Text className='font-psemibold text-[16px] mt-[20px] mb-[10px] ml-[15px]'>Điều kiện và điều khoản</Text>
      <View className='bg-white h-[85%] rounded-[7px]'>
        <ScrollView>
          <Text className='font-pregular text-[12px] m-[14px] text-[#7E7E7E]'>
            Ứng dụng My Braces được phát triển nhằm phục vụ mục đích giúp khách hàng của phòng khám trực tiếp theo dõi được các thông tin về hồ sơ, tình trạng bệnh của họ. Bên cạnh đó giúp họ tra cứu đọc và xem các bài viết, lời dặn hay video.
          </Text>
          <Text className='font-pbold text-[14px] mx-[14px] my-[5px] text-[#7E7E7E]'>
            1. Thu thập thông tin cá nhân
          </Text>
          <Text className='font-pbold text-[12px] mx-[14px] text-[#7E7E7E]'>
            1.1. Các loại thông tin thu thập
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            Thông tin liên lạc của bạn, thông tin từ (các) nguồn dữ liệu do bạn cung cấp.
            Thu thập các hình ảnh bao gồm ảnh đại diện trên ứng dụng, ảnh bạn gửi cho phòng khám qua chức năng trò chuyện trên ứng dụng, ảnh cá nhân bạn chụp để lưu trong thư viện ảnh của ứng dụng.
            Nội dung của cuộc trò chuyện giữa bạn và phòng khám qua chức năng trò chuyện trên ứng dụng.
          </Text>
          <Text className='font-pbold text-[12px] mx-[14px] text-[#7E7E7E]'>
            1.2. Mục đích thu thập dữ liệu
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            Bạn có quyền lựa chọn cung cấp hoặc không đối với các dữ liệu mà ứng dụng thu thập. Dữ liệu được thu thập từ bạn có thể được chúng tôi sử dụng cho các mục đích sau đây:

            Thông tin cá nhân của bạn được sử dụng để đăng nhập, hiển thị, nhận dạng và quản lý trên ứng dụng.
            Hình ảnh đại diện bạn cung cấp sẽ được dùng để hiển thị dưới dạng ảnh đại diện của bạn trên ứng dụng.
            Hình ảnh bạn chụp và lưu trong chức năng Thư viện ảnh của bạn sẽ phục vụ mục đích lưu trữ, giúp bạn quan sát và theo dõi. Hình ảnh đó phòng khám sẽ không sử dụng với bất kì mục đích nào khác nếu không được sự cho phép của bạn.
            Đoạn hội thoại cũng như các hình ảnh bạn gửi trong đoạn hội thoại trực tiếp với phòng khám trong chức năng Trò chuyện của ứng dụng được lưu lại nhằm mục đích lưu trữ, ra soát, giúp bạn đọc và xem lại bất kì lúc nào.
          </Text>
          <Text className='font-pbold text-[14px] mx-[14px] my-[5px] text-[#7E7E7E]'>
            2. Bảo vệ sự riêng tư và bản quyền
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            Dữ liệu chúng tôi thu thập đều là các dữ liệu không bắt buộc, bạn có quyền cung cấp hoặc không đối với các dữ liệu này. Dữ liệu chỉ nhằm mục đích phục vụ giúp bạn có trải nghiệm tối đa khi sử dụng ứng dụng và dịch vụ tại nha khoa Thùy Anh.
            Các dữ liệu này hoàn toàn không được chia sẻ với bất kì một bên thứ ba nào. Chúng tôi cam đoan về việc bảo vệ sự riêng tư và hình ảnh của bạn. Các hình ảnh của bạn sẽ không được sử dụng với bất kì mục đích nào khác ngoài lưu trữ nếu không có được sự đồng ý của bạn.
            Bạn có thể yêu cầu xóa tài khoản cũng như các dữ liệu lưu trữ của bạn bất kì lúc nào.
          </Text>
          <Text className='font-pbold text-[14px] mx-[14px] my-[5px] text-[#7E7E7E]'>
            3. Quyền truy cập
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            Khi sử dụng Ứng dụng, Người dùng đồng ý cho phép ứng dụng có quyền truy cập các chức năng sau:
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            (1) Truy cập vào Internet từ thiết bị người dùng.
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            (2) Truy cập camera để khách hàng chụp ảnh của họ và lưu trữ dưới dạng một thư viện hình ảnh trên ứng dụng.
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            (3) Truy cập vào Ảnh để khách hàng có thể gửi hình ảnh trong đoạn hội thoại trực tiếp với phòng khám, để khách hàng chọn ảnh và thay đổi ảnh đại diện.
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            (4) Gửi thông báo tới thiết bị của người dùng.
          </Text>
          <Text className='font-pbold text-[14px] mx-[14px] my-[5px] text-[#7E7E7E]'>
            4. Thay đổi và cập nhật
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            Chúng tôi có quyền thay đổi, chỉnh sửa hoặc bổ sung Chính sách về quyền riêng tư theo quyết định của mình và vào bất kỳ lúc nào, bằng cách đăng Chính sách về quyền riêng tư đã được thay đổi, sửa đổi hoặc bổ sung trên hoặc thông qua ứng dụng My Braces hoặc thông qua các phương tiện khác. Việc bạn tiếp tục sử dụng My Braces sau khi đăng bất kỳ thay đổi, sửa đổi hoặc bổ sung nào về Chính sách quyền riêng tư sẽ cấu thành việc bạn chấp nhận sự thay đổi, sửa đổi hoặc bổ sung đó. Nếu bạn không đồng ý với bất kỳ thay đổi, chỉnh sửa hoặc bổ sung nào đối với Chính sách về quyền riêng tư, vui lòng không sử dụng ứng dụng My Braces.
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            © Bản quyền thuộc về 2025 Đặng Tuấn Đạt
          </Text>
        </ScrollView>
      </View>
    </View>
  )
}