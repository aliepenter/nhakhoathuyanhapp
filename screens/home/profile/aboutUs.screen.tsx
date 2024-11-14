import { View, Text, ScrollView, Image, Dimensions, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import BannerSlide from '@/components/common/BannerSlide'
import { getBanners } from '@/lib/apiCall';

export default function AboutUsScreen() {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
      fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
      try {
          const bannersResponse = await getBanners();
          setTimeout(() => {
              if (bannersResponse.data) {
                  setBanners(bannersResponse.data);
              }
          }, 1000);

      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };
  return (
    <View className='h-full bg-[#F2F1F6] px-[19px]'>
      <Text className='font-psemibold text-[16px] mt-[20px] mb-[10px] ml-[15px]'>Về chúng tôi</Text>
      <View className='bg-white h-[85%] rounded-[7px]'>
        <ScrollView>
          <Text className='font-psemibold text-[14px] m-[14px] text-[#51B81A]'>
            NHA KHOA THÙY ANH – ĐỊA CHỈ NHA KHOA
            UY TÍN HÀNG ĐẦU VIỆT NAM
          </Text>
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            Nha khoa Thùy Anh – hệ thống nha khoa uy tín hàng đầu Việt Nam, là địa chỉ nha khoa cung cấp các dịch vụ chuyên sâu về niềng răng, trồng răng implant và thẩm mỹ nụ cười. Với đội ngũ bác sĩ chuyên môn cao, trang thiết bị hiện đại bậc nhất, chúng tôi cam kết mang đến cho bạn trải nghiệm làm răng nhẹ nhàng – chính xác – không đau.
          </Text>
          <Text className='font-pbold text-[12px] mx-[14px] text-[#1A1A1A]'>
            Hệ thống cơ sở tại Hà Nội - Thái Nguyên -  Bắc Giang
          </Text>
          <BannerSlide banners={banners} type={3} />
          <Text className='font-pregular text-[12px] mx-[14px] text-[#7E7E7E]'>
            Với mong muốn mang giải pháp điều trị răng miệng theo tiêu chuẩn Giải pháp tối ưu can thiệp tối thiểu đến với mọi khách hàng, nha khoa Thùy Anh sau 10 năm thành lập đã phát triển hệ thống 6 cơ sở tại Hà Nội – Thái Nguyên và Bắc Giang.
          </Text>
        </ScrollView>
      </View>
    </View>
  )
}