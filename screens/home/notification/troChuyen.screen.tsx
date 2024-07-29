import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants'
import { router } from 'expo-router';
import useUser from '@/hooks/auth/useUser';
import { getLichSuTroChuyen } from '@/lib/apiCall';

export default function TroChuyenScreen() {
    const { user } = useUser();
    const [cuocTroChuyen, setCuocTroChuyen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        setLoading(true);
        if (user) {
            const userId = user.id;
            await fetchCuocTroChuyen(userId);
        }
        setRefreshing(false);
    };
    const handleTruncate = (title: string) => {
        const truncatedTitle = title && title.length > 80 ? `${title.slice(0, 80)}...` : title;
        return truncatedTitle;
    }
    useEffect(() => {
        if (user) {
            const userId = user.id;
            fetchCuocTroChuyen(userId);
        }
    }, [user]);
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
            }, 1000);

        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    };
    const onChatPress = () => {
        router.push({
            pathname: "(routes)/chat",
            params: { headerTitle: 'Nha khoa Thùy Anh gửi bạn hợp đồng' },
        });
    }
    return (
        <ScrollView className='bg-white flex-1' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View className='px-[17px]'>
                {!loading
                    ?
                    cuocTroChuyen && cuocTroChuyen.length != 0
                        ?
                        cuocTroChuyen.map((item: CuocTroChuyen, index: number) => {
                            const isLastItem = index === cuocTroChuyen.length - 1;
                            return (
                                <TouchableOpacity key={index} onPress={onChatPress} className={`my-[7px] mt-[14px] rounded-[7px] bg-[#F5F5F5] p-[10px] ${isLastItem ? 'mb-28' : ''}`} style={styles.boxShadow}>
                                    <View className={`flex-row items-center justify-center flex-wrap ${item.seen === 1 ? 'opacity-50' : ''}`}>
                                        <View className='w-[80%] items-start'>
                                            <Text className={`text-[#51B81A] font-pbold text-[14px] ${item.status === 0 ? 'line-through' : ''}`}>{item.title}</Text>
                                        </View>
                                        <View className='w-[20%] items-end'>
                                            <Text className='text-[#6C6C6C] font-pmedium text-[10px]'>1ph trước</Text>
                                        </View>
                                    </View>
                                    <View className={`flex-row items-center justify-center flex-wrap ${item.seen === 1 ? 'opacity-50' : ''}`}>
                                        <View className='w-[85%]'>
                                            <Text className='font-pregular text-[12px]'>{handleTruncate('Lorem ipsum dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit. ')}</Text>
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
                        <ActivityIndicator />
                    </View>
                }

            </View>
        </ScrollView>
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
    }
});