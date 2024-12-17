import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants'
import { router } from 'expo-router';
import useUser from '@/hooks/auth/useUser';
import { createCuocTroChuyen, getLichSuTroChuyen, seenCuocTroChuyen } from '@/lib/apiCall';
import useUnseenMessages from '@/hooks/useUnseenMessages';
import { useFocusEffect } from '@react-navigation/native';
import Dialog from "react-native-dialog";
import Toast from 'react-native-toast-message';
import { timeAgo } from '@/lib/commonFunctions';
import useSocket from '@/hooks/useSocket';
import { SERVER_URI } from '@/utils/uri';

export default function TroChuyenScreen() {
    const { user } = useUser();
    const { messages } = useSocket(SERVER_URI);
    const [flag, setFlag] = useState<boolean>(false);
    const [cuocTroChuyen, setCuocTroChuyen] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);
    const { setRefetch } = useUnseenMessages();
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        if (user) {
            const userId = user.id;
            await fetchCuocTroChuyen(userId);
        }
        setRefreshing(false);
    };
    const handleCancel = () => {
        setFlag(true);
        setVisible(false);
        setNewTitle('');
        setTimeout(() => {
            setFlag(false);
        }, 1000);
    };
    const onCreate = async () => {
        setFlag(true);
        if (newTitle.trim()) {
            const cuocTroChuyen: any = {
                user_id: user?.id,
                status: 1,
                seen: 1,
                title: newTitle,
            };
            try {
                const res = await createCuocTroChuyen(cuocTroChuyen);
                if (res && res.data) {
                    onChatPress(res.data.title, res.data.id, res.data.status);
                }

            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Đã có lỗi xảy ra, xin thử lại sau',
                });
            } finally {
                setVisible(false);
                setNewTitle('');
            }
        }
        setTimeout(() => {
            setFlag(false);
        }, 1000);
    }

    const handleTruncate = (title: string) => {
        const truncatedTitle = title && title.length > 80 ? `${title.slice(0, 80)}...` : title;
        return truncatedTitle;
    }

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                const userId = user.id;
                fetchCuocTroChuyen(userId);
            }
        }, [user, messages])
    );

    const seen = async (cuoc_tro_chuyen_id: number) => {
        try {
            const cuocTroChuyen: any = {
                seen: 1,
            };
            await seenCuocTroChuyen(cuoc_tro_chuyen_id, cuocTroChuyen);
            if (user) {
                const userId = user.id;
                await fetchCuocTroChuyen(userId);
            }
            setRefetch(Date.now());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchCuocTroChuyen = async (userId: number) => {
        try {
            const cuocTroChuyenData = await getLichSuTroChuyen(userId);
            setTimeout(() => {
                if (cuocTroChuyenData) {
                    setCuocTroChuyen(cuocTroChuyenData.data);
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            }, 0);

        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    };
    const onChatPress = (title: any, cuoc_tro_chuyen_id: number, status: number) => {
        setFlag(true);
        seen(cuoc_tro_chuyen_id);
        router.push({
            pathname: "/(routes)/chat",
            params: { headerTitle: title, cuoc_tro_chuyen_id, status },
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);

    }
    const handlePressCreate = () => {
        setFlag(true);
        setVisible(true);
        setTimeout(() => {
            setFlag(false)
        }, 1000);
    }

    return (
        <>
            <ScrollView className='bg-white flex-1' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className='px-[17px]'>
                    {
                        !loading
                            ?
                            cuocTroChuyen && cuocTroChuyen.length != 0
                                ?
                                cuocTroChuyen.map((item: CuocTroChuyen, index: number) => {
                                    const isLastItem = index === cuocTroChuyen.length - 1;
                                    return (
                                        <TouchableOpacity disabled={flag} key={index} onPress={() => onChatPress(item.title, item.id, item.status)} className={`my-[7px] mt-[14px] rounded-[7px] bg-[#F5F5F5] p-[10px] ${isLastItem ? 'mb-28' : ''}`} style={styles.boxShadow}>
                                            <View className={`flex-row items-center justify-center flex-wrap ${item.seen === 1 ? 'opacity-50' : ''}`}>
                                                <View className='w-[75%] items-start'>
                                                    <Text className={`text-[#51B81A] font-pbold text-[14px] ${item.status === 0 ? 'line-through' : ''}`}>{item.title}</Text>
                                                </View>
                                                <View className='w-[25%] items-end'>
                                                    <Text className='text-[#6C6C6C] font-pmedium text-[10px]'>{timeAgo(item.createdAt)}</Text>
                                                </View>
                                            </View>
                                            <View className={`flex-row items-center justify-center flex-wrap ${item.seen === 1 ? 'opacity-50' : ''}`}>
                                                <View className='w-[85%]'>
                                                    <Text className='font-pregular text-[12px]'>{handleTruncate('Cảm ơn bạn đã sử dụng ứng dụng Nha khoa Thùy Anh. Chúng tôi sẽ giải đáp thắc mắc của bạn trong thời gian sớm nhất.')}</Text>
                                                </View>
                                                <View className='w-[15%] items-center'>
                                                    <Image source={item.seen === 1 ? icons.circle : icons.circleActive} resizeMode='cover' className={` w-[13px] h-[13px] right-[-6.5px]`} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                                )
                                :
                                <View className='justify-center items-center h-96'>
                                    <Text>Không có dữ liệu trò chuyện</Text>
                                </View>
                            :
                            <View className="h-64 justify-center">
                                <ActivityIndicator color={'#00E5E5'} />
                            </View>
                    }
                </View>
            </ScrollView>
            <TouchableOpacity disabled={flag} className='absolute bottom-24 left-3 w-[50] h-[50] bg-[#51B81A] rounded-full justify-center items-center' onPress={() => handlePressCreate()}>
                <Image source={icons.plus2} className='h-7 w-7' />
            </TouchableOpacity>
            <Dialog.Container visible={visible}>
                <Dialog.Title>Tạo mới cuộc trò chuyện</Dialog.Title>
                <Dialog.Input
                    value={newTitle}
                    onChangeText={setNewTitle}
                    placeholder="Chủ đề"
                />
                <Dialog.Button disabled={flag} label="Tạo mới" onPress={onCreate} />
                <Dialog.Button disabled={flag} label="Hủy bỏ" onPress={handleCancel} />
            </Dialog.Container>
        </>
    )
}

const styles = StyleSheet.create({
    boxShadow: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
});