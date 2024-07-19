import { View, Image, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '@/constants'
import { getHopDong } from '@/lib/apiCall';

export default function HopDongScreen() {
    const [hopDong, setHopDong] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHopDong();
    }, []);
    const fetchHopDong = async () => {
        try {
            const hopDongData = await getHopDong();

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
    return (
        <View className='flex-row justify-center gap-10 mt-[34px]'>
            {
                hopDong && hopDong.length != 0
                    ?
                    hopDong.map((item: HopDong, index: number) => (
                        <View key={index}>
                            <Image className='w-[115px] h-[115px]' resizeMode='cover' source={icons.hopDong} />
                            <Text>{item.ten_hop_dong}</Text>
                        </View>
                    ))
                    :
                    <View className={`h-[202px] justify-center`}>
                        <ActivityIndicator />
                    </View>
            }

        </View>
    )
}