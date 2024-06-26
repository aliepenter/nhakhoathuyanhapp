import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

interface AuthState {
    token: string | null;
    isLoggedIn: boolean;
    userInfo: any;
}

interface AuthProps {
    authState: AuthState;
    onLogin: (username: string, password: string) => Promise<any>;
    onLogout: () => Promise<void>;
}

const API_URL = "http://192.168.1.100"
const API_PORT = 3000
const TOKEN_KEY = 'Dat.2624';
export const URL = `${API_URL}:${API_PORT}`;

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authState, setAuthState] = useState<AuthState>({ token: null, isLoggedIn: false, userInfo: null });
    
    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const userProfile = await axios.get(`${URL}/auth/profile`);
                    setAuthState({
                        token: token,
                        isLoggedIn: true,
                        userInfo: userProfile.data
                    });
                } catch (error) {
                    return null;
                }
            }
        }
        loadToken();
    }, [])

    const login = async (username: string, password: string) => {
        const result = await axios.post(`${URL}/auth/login`, { username, password });
        if (result) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${result.data}`;
                const userProfile = await axios.get(`${URL}/auth/profile`);
                setAuthState({ token: result.data, isLoggedIn: true, userInfo: userProfile.data });
                await SecureStore.setItemAsync(TOKEN_KEY, result.data);
            } catch (error) {
                throw error;
            }
        } else {
            throw Error;
        }
    }
    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            axios.defaults.headers.common['Authorization'] = '';
            setAuthState({ token: null, isLoggedIn: false, userInfo: null });
            router.push('/sign-in');
        } catch (error) {
            throw error;
        }

    }
    const value: AuthProps = {
        authState,
        onLogin: login,
        onLogout: logout,
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}