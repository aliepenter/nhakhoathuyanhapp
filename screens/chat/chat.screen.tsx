import { View, Text, ScrollView, ActivityIndicator, TextInput, Platform, TouchableOpacity, KeyboardAvoidingView, Keyboard, RefreshControl } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomHeader from '@/components/common/CustomHeader'
import { Image } from 'expo-image'
import useUser from '@/hooks/auth/useUser'
import { getMessages } from '@/lib/apiCall'
import { icons, images } from '@/constants'
export default function ChatScreen({ headerTitle, cuoc_tro_chuyen_id }: any) {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const scrollViewRef = useRef<ScrollView>(null);

    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchMessages();
        setRefreshing(false);
    };
    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };
    useEffect(() => {
        fetchMessages();
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                scrollToBottom();
            }
        );
        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);
    const fetchMessages = async () => {
        try {
            const res = await getMessages(cuoc_tro_chuyen_id);
            if (res) {
                setMessages(res.data);
                setLoading(false)
            } else {
                setLoading(false);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    };
    return (
        <View className='bg-white flex-1'>
            <CustomHeader title={headerTitle} customStyle="bg-white" />
            {
                !loading
                    ?
                    <>
                        <ScrollView
                            className='px-[11px] pt-4'
                            ref={scrollViewRef}
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            {
                                messages && messages.length != 0
                                    ?
                                    messages.map((item: Message, index: number) => {
                                        const isLastItem = index === messages.length - 1;

                                        return (
                                            item.nguoi_gui_id === user?.id
                                                ?
                                                <View key={index} className={`flex-row-reverse ${isLastItem ? 'mb-8' : 'mb-4'}`}>
                                                    <View className='max-w-[80%]'>
                                                        <View className='bg-[#EEF1F4] p-[16px] rounded-t-[16px] rounded-bl-[16px] rounded-br-[3px]'>
                                                            <Text className='text-[14px] font-pregular'>{item.noi_dung}</Text>
                                                        </View>
                                                        <View>
                                                            <Text className='text-[#616C76] text-right text-[12px] font-pregular'>4:38 AM</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                :
                                                <View key={index} className={`flex-row ${isLastItem ? 'mb-8' : 'mb-4'}`}>
                                                    <View className='w-[13%] justify-end'>
                                                        <Image source={images.logo} contentFit='contain' className='rounded-full w-[40px] h-[40px]' />
                                                    </View>
                                                    <View className='max-w-[80%]'>
                                                        <View className='bg-[#EEF1F4] p-[16px] rounded-t-[16px] rounded-br-[16px] rounded-bl-[3px]'>
                                                            <Text className='text-[14px] font-pregular'>{item.noi_dung}</Text>
                                                        </View>
                                                        <View>
                                                            <Text className='text-[#616C76] text-[12px] font-pregular'>4:38 AM</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                        )
                                    }
                                    )
                                    :
                                    <View className='justify-center items-center h-96'>
                                        <Text className='text-center font-pregular'>Cảm ơn bạn đã sử dụng ứng dụng Nha khoa Thùy Anh. Chúng tôi sẽ giải đáp thắc mắc của bạn trong thời gian sớm nhất.</Text>
                                    </View>
                            }
                        </ScrollView>
                        <KeyboardAvoidingView className='rounded-t-[16px] bg-[#EDEDED]' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <View className='h-[73px] px-[11px] pt-2 pb-4 w-full flex-row'>
                                <View className='h-full w-[90%]'>
                                    <TextInput
                                        className={`${Platform.OS === 'ios' ? 'py-4' : 'py-1'} flex-1 rounded-[25px] bg-[#EFF6FC] pr-4 pl-[51px] justify-center text-black font-semibold text-[14px]`}
                                        multiline={true}
                                        numberOfLines={6}
                                        autoFocus={true}
                                    />
                                    <TouchableOpacity className='absolute flex-row items-center left-[15px] h-[15px]' style={{ top: 49 / 2 - 8 }}>
                                        <Image className='w-[21px] h-full mr-[6px]' source={icons.gallery} contentFit='cover' />
                                    </TouchableOpacity>
                                </View>
                                <View className='h-full w-[10%] items-end justify-center'>
                                    <TouchableOpacity className='h-[30px] w-[30px]'>
                                        <Image className='w-full h-full mr-[6px]' source={icons.send} contentFit='fill' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </>
                    :
                    <View className="h-96 justify-center">
                        <ActivityIndicator color={'#00E5E5'} />
                    </View>
            }
        </View>
    )
}