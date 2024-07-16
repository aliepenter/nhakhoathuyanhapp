import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import FaqDropdown from '@/components/profile/FaqDropdown';
import { getFaq } from '@/lib/apiCall';

export default function FaqScreen() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetchFaqData();
  }, []);

  const fetchFaqData = async () => {
    try {
      const faq = await getFaq();
      setTimeout(() => {
        if (faq.data) {
          setFaqs(faq.data);
        }
      }, 1000);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      {
        faqs && faqs.length !== 0
          ?
          <ScrollView className='bg-[#F2F1F6] px-[19px]'>
            <Text className='font-psemibold text-[16px] ml-[15px] mb-[13px] mt-[24px]'>FAQ</Text>

            {
              faqs.map((faq, index) => (
                <FaqDropdown key={index} faq={faq} />
              ))
            }

          </ScrollView>
          :
          <View className="bg-[#FAFAFA] h-full justify-center">
            <ActivityIndicator />
          </View>
      }
    </>
  )
}