// api/apiService.js

import axios from 'axios';

const ENDPOINT = "http://192.168.1.102:3000";

export const signin = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${ENDPOINT}/auth/login`, { username, password });
        return {
            code: 200,
            data: response.data
        };
    } catch (error: any) {
        if (error.response) {
            return {
                code: error.response.status,
            };
        } else {
            throw error;
        }
    }
};

export const getCurrentUser = async (token: string) => {
    try {
        const response = await axios.get(`${ENDPOINT}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            code: 200,
            data: response.data
        };
    } catch (error: any) {
        if (error.response) {
            return {
                code: error.response.status,
            };
        } else {
            throw error;
        }
    }
}