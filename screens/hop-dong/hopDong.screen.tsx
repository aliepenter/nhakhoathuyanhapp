import { View, Image, Text, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants'
import { getHopDong } from '@/lib/apiCall';
import useUser from '@/hooks/auth/useUser';
import { router } from 'expo-router';

export default function HopDongScreen() {
    const [hopDong, setHopDong] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [flag, setFlag] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            const userId = user.id;
            fetchHopDong(userId);
        }
    }, [user]);
    const fetchHopDong = async (userId: number) => {
        try {
            const hopDongData = await getHopDong(userId);

            setTimeout(() => {
                if (hopDongData) {
                    setLoading(false)
                    setHopDong(hopDongData.data);
                } else {
                    setLoading(false);
                }
            }, 1000);

        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    };
    const handlePress = (hop_dong_chi_tiet_id: any, ten_hop_dong: any) => {
        setFlag(true);
        router.push({
            pathname: "/(routes)/hop-dong/hopDongDetail",
            params: {
                headerTitle: ten_hop_dong,
            },
        });
        setTimeout(() => {
            setFlag(false)
        }, 1000);

    }
    return (
        <View className='flex-row justify-center gap-10 mt-[34px]'>
            {
                !loading
                    ?
                    hopDong && hopDong.length != 0
                        ?
                        hopDong.map((item: HopDong, index: number) => (
                            <Pressable
                                disabled={flag}
                                onPress={() => handlePress(item.hop_dong_chi_tiet_id, item.ten_hop_dong)}
                                key={index}
                                className='justify-center items-center'
                            >
                                <Image className='w-[115px] h-[115px]' resizeMode='cover' source={icons.hopDong} />
                                <Text>{item.ten_hop_dong}</Text>
                            </Pressable>
                        ))
                        :
                        <View className='justify-center items-center h-96'>
                            <Text>Không có dữ liệu hợp đồng</Text>
                        </View>
                    :
                    <View className={`h-[202px] justify-center`}>
                        <ActivityIndicator color={'#00E5E5'} />
                    </View>
            }

        </View>
    )
}