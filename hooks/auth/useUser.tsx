import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import * as SecureStore from 'expo-secure-store';
const TOKEN_KEY = 'Dat.2624';

export default function useUser() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [error, setError] = useState("");
    const [refetch, setRefetch] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                if (!token) {
                    setLoading(false);
                    return;
                }
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const res = await axios.get(`${SERVER_URI}/auth/profile`);
                setUser(res.data);
                setError("");
            } catch (err) {
                setError("Đã có lỗi xảy ra, xin vui lòng thử lại sau");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [refetch]);

    return { loading, user, error, setRefetch };
}
