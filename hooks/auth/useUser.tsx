import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
const TOKEN_KEY = 'Dat.2624';

export default function useUser() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [error, setError] = useState("");
    const [refetch, setRefetch] = useState(false);
    useEffect(() => {
        const subscription = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    await axios.get(`${SERVER_URI}/auth/profile`)
                        .then((res: any) => {
                            setUser(res.data);
                            setTimeout(() => {
                                setLoading(false);
                            }, 0);
                        })
                        .catch((error: any) => {

                            setError("Đã có lỗi xảy ra, xin vui lòng thử lại sau");
                            setTimeout(() => {
                                setLoading(false);
                            }, 0);
                        });;

                } catch (error) {

                    setError("Đã có lỗi xảy ra, xin vui lòng thử lại sau")
                    setTimeout(() => {
                        setLoading(false);
                    }, 0);
                }
            } else {
                setTimeout(() => {
                    setLoading(false);
                }, 0);
            }

        };
        subscription();
    }, [refetch]);
    return { loading, user, error, setRefetch, refetch };

}
