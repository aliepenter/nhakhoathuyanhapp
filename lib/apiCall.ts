// api/apiService.js

import axios from "axios";
import { useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";




const API_URL = "http://192.168.1.100"
const API_PORT = 3000
const TOKEN_KEY = 'Dat.2624';
export const URL = `${API_URL}:${API_PORT}`;

export const getVideos = async () => {
  try {
    const response = await axios.get(`${URL}/videos`);
    return {
      code: 200,
      data: response.data,
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

export const trackPhoneNumber = async (username: string) => {
  try {
    const result = await axios.get(`${URL}/users/${username}`);

    if (result) {
      if (result.data) {
        return true;
      } else {
        return false;
      }
    } else {
      throw Error;
    }
  } catch (error) {
    throw error;
  }
}

export const login = async (username: string, password: string) => {
  const result = await axios.post(`${URL}/auth/login`, { username, password });
  if (result) {
    try {
      // axios.defaults.headers.common['Authorization'] = `Bearer ${result.data}`;
      // const userProfile = await axios.get(`${URL}/auth/profile`);
      // setAuthState({ token: result.data, isLoggedIn: true, userInfo: userProfile.data });
      await SecureStore.setItemAsync(TOKEN_KEY, result.data);
    } catch (error) {
      throw error;
    }
  } else {
    throw Error;
  }
}


export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    axios.defaults.headers.common['Authorization'] = '';
    router.push('/sign-in');
  } catch (error) {
    throw error;
  }

}

export const getProfile = async () => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userProfile = await axios.get(`${URL}/auth/profile`);
      if (!userProfile) throw Error;
      return userProfile.data;
      // setAuthState({
      //   token: token,
      //   isLoggedIn: true,
      //   userInfo: userProfile.data
      // });
    } catch (error) {
      return null;
    }
  }
}