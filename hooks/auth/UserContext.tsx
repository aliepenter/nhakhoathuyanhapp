import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'Dat.2624';

interface User {
    id: string;
    name: string;
    main_status: number;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string;
}

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

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
                if (res) {
                    const userActive = res.data.find((user: { main_status: number; }) => user.main_status === 1);
                    setUser(userActive || null);
                }
                setError("");
            } catch (err) {
                setError("Đã có lỗi xảy ra, xin vui lòng thử lại sau");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
