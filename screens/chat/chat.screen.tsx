import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Platform,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import { Image } from 'expo-image';
import useUser from '@/hooks/auth/useUser';
import { getMessages } from '@/lib/apiCall';
import { icons, images } from '@/constants';
import io, { Socket } from 'socket.io-client';
import { formatISODateToAMPM, getToday } from '@/lib/commonFunctions';
import * as ImagePicker from "expo-image-picker";
import { SERVER_URI, SERVER_URL, SOCKET_URI } from '@/utils/uri';
import axios from 'axios';
import Toast from 'react-native-toast-message';

interface ChatScreenProps {
    headerTitle: string;
    cuoc_tro_chuyen_id: number;
    disable: boolean;
}


export default function ChatScreen({ headerTitle, cuoc_tro_chuyen_id, disable }: ChatScreenProps) {
    const { user } = useUser();
    const [messages, setMessages] = useState<Messages[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };
    const [socket, setSocket] = useState<Socket | null>(null);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        fetchMessages();
        const socketIo = io(SOCKET_URI, { transports: ['websocket'], autoConnect: false });
        socketIo.connect();
        setSocket(socketIo);

        socketIo.on('message', (payload: Messages) => {
            if (payload.cuoc_tro_chuyen_id == cuoc_tro_chuyen_id) {
                setMessages((prevMessages) => [...prevMessages, payload]);
            }
        });
        // Handle keyboard showing
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                scrollToBottom();
            }
        );

        return () => {
            socketIo.disconnect();
            keyboardDidShowListener.remove();
        };
    }, [cuoc_tro_chuyen_id]);


    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        await fetchMessages();
        setRefreshing(false);
    };

    const fetchMessages = async () => {
        try {
            const res = await getMessages(cuoc_tro_chuyen_id);
            if (res) {
                setMessages(res.data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };



    const handleSendMessage = () => {
        if (newMessage.trim() && socket) {
            const payload: Messages = {
                nguoi_gui_id: user?.id || null,
                cuoc_tro_chuyen_id: cuoc_tro_chuyen_id,
                noi_dung: newMessage.trim(),
                createdAt: new Date().toISOString(),
                image_path: null,
            };
            socket.emit('message', payload);
            setNewMessage('');
        }
    };


    useEffect(() => {
        Platform.OS === 'ios' ?
            setTimeout(() => {
                scrollToBottom()
            }, 100)
            :
            scrollToBottom()

    }, [messages]);

    const handleCamera = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        if (!result.canceled) {
            if (result.assets[0].uri) {
                const fileName = `${getToday("path")}.jpg`;
                try {
                    const formData = new FormData();
                    formData.append("file", {
                        uri: result.assets[0].uri,
                        type: "image/jpeg",
                        name: fileName,
                    } as any);
                    await axios.post(`${SERVER_URI}/file/upload-chat`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    if (socket) {
                        const payload: Messages = {
                            nguoi_gui_id: user?.id || null,
                            cuoc_tro_chuyen_id: cuoc_tro_chuyen_id,
                            noi_dung: '',
                            createdAt: new Date().toISOString(),
                            image_path: `img/uploads/chat/${fileName}`,
                        };
                        socket.emit('message', payload);
                        setNewMessage('');
                    }
                } catch (error) {
                    Toast.show({
                        type: "error",
                        text1: "Đã có lỗi xảy ra khi đăng ảnh, xin thử lại sau",
                    });
                }
            }
        }
    };

    return (
        <View className='bg-white flex-1'>
            <CustomHeader title={headerTitle} customStyle='bg-white' />
            {!loading ? (
                <>
                    <ScrollView
                        className='px-[11px] pt-4'
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        {messages && messages.length !== 0 ? (
                            messages.map((item: Messages, index: number) => {
                                const isLastItem = index === messages.length - 1;

                                return item.nguoi_gui_id === user?.id ? (
                                    <View key={index} className={`flex-row-reverse ${isLastItem ? 'mb-8' : 'mb-4'}`}>
                                        <View className='max-w-[80%]'>
                                            {
                                                item.image_path == null
                                                    ?
                                                    item.noi_dung
                                                        ?
                                                        <View className='bg-[#EEF1F4] p-[16px] rounded-t-[16px] rounded-bl-[16px] rounded-br-[3px]'>
                                                            < Text className='text-[14px] font-pregular'>{item.noi_dung}</Text>
                                                        </View>
                                                        :
                                                        null
                                                    :
                                                    <View className="h-[400px] w-[300px] bg-[#EEF1F4] rounded-t-[16px] rounded-bl-[16px] rounded-br-[3px]">
                                                        <Image
                                                            source={{ uri: `${SERVER_URL}${item.image_path}` }}
                                                            contentFit="cover"
                                                            alt="image"
                                                            transition={500}
                                                            className="w-full h-full rounded-t-[16px] rounded-bl-[16px] rounded-br-[3px]"
                                                        />
                                                    </View>
                                            }
                                            <View>
                                                <Text className='text-[#616C76] text-right text-[12px] font-pregular'>{formatISODateToAMPM(item.createdAt)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={index} className={`flex-row ${isLastItem ? 'mb-8' : 'mb-4'}`}>
                                        <View className='w-[13%] justify-end'>
                                            <Image source={images.logonotext} contentFit='contain' className='rounded-full w-[40px] h-[40px]' />
                                        </View>
                                        <View className='max-w-[80%]'>
                                            {
                                                item.image_path == null
                                                    ?
                                                    item.noi_dung
                                                        ?
                                                        <View className='bg-[#EEF1F4] p-[16px] rounded-t-[16px] rounded-br-[16px] rounded-bl-[3px]'>
                                                            <Text className='text-[14px] font-pregular'>{item.noi_dung}</Text>
                                                        </View>
                                                        :
                                                        null
                                                    :
                                                    <View className="h-[400px] w-[300px] bg-[#EEF1F4] rounded-t-[16px] rounded-br-[16px] rounded-bl-[3px]">
                                                        <Image
                                                            source={{ uri: `${SERVER_URL}${item.image_path}` }}
                                                            contentFit="cover"
                                                            alt="image"
                                                            transition={500}
                                                            className="w-full h-full rounded-t-[16px] rounded-br-[16px] rounded-bl-[3px]"
                                                        />
                                                    </View>
                                            }
                                            <View>
                                                <Text className='text-[#616C76] text-right text-[12px] font-pregular'>{formatISODateToAMPM(item.createdAt)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View className='justify-center items-center h-96'>
                                <Text className='text-center font-pregular'>
                                    Cảm ơn bạn đã sử dụng ứng dụng My Braces. Chúng tôi sẽ giải đáp thắc mắc của bạn trong thời gian sớm nhất.
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                    {
                        !disable ?
                            <KeyboardAvoidingView className='rounded-t-[16px] bg-[#EDEDED]' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                                <View className='h-[73px] px-[11px] pt-2 pb-4 w-full flex-row'>
                                    <View className='h-full w-[90%]'>
                                        <TextInput
                                            className={`${Platform.OS === 'ios' ? 'py-4' : 'py-1'} flex-1 rounded-[25px] bg-[#EFF6FC] pr-4 pl-[51px] justify-center text-black font-semibold text-[14px]`}
                                            multiline
                                            numberOfLines={6}
                                            value={newMessage}
                                            onChangeText={setNewMessage}
                                            autoFocus
                                        />
                                        <TouchableOpacity onPress={handleCamera} className='absolute flex-row items-center left-[15px] h-[15px]' style={{ top: 49 / 2 - 8 }}>
                                            <Image className='w-[21px] h-full mr-[6px]' source={icons.gallery} contentFit='cover' />
                                        </TouchableOpacity>
                                    </View>
                                    <View className='h-full w-[10%] items-end justify-center'>
                                        <TouchableOpacity className='h-[30px] w-[30px]' onPress={handleSendMessage}>
                                            <Image className='w-full h-full mr-[6px]' source={icons.send} contentFit='fill' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                            :
                            null
                    }

                </>
            ) : (
                <View className='h-96 justify-center'>
                    <ActivityIndicator color='#00E5E5' />
                </View>
            )
            }
        </View >
    );
}
