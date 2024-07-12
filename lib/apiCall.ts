// api/apiService.js

import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { SERVER_URI } from "@/utils/uri";


const TOKEN_KEY = 'Dat.2624';

export const getVideos = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/videos`);
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

export const getBanners = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/banners`);
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

export const getPosts = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/posts`);
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


export const getBranches = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/branches`);
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
    const result = await axios.get(`${SERVER_URI}/users/${username}`);

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
  const result = await axios.post(`${SERVER_URI}/auth/login`, { username, password });
  if (result) {
    try {
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
    router.dismissAll();
    router.replace('/(routes)/login');
  } catch (error) {
    throw error;
  }

}

export const getChinhNha = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const chinhNha = await axios.get(`${SERVER_URI}/chinh-nha/${userId}`);
      if (!chinhNha) return null;
      return {
        code: 200,
        data: chinhNha.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getChinhNhaChiTiet = async (id: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const chinhNhaDetail = await axios.get(`${SERVER_URI}/chinh-nha-chi-tiet/${id}`);
      if (!chinhNhaDetail) return null;
      return {
        code: 200,
        data: chinhNhaDetail.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getVideoCategoryById = async (chinh_nha_chi_tiet_id: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const videoCategory = await axios.get(`${SERVER_URI}/video-category/${chinh_nha_chi_tiet_id}`);
      if (!videoCategory) null;
      return {
        code: 200,
        data: videoCategory.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getBaiVietCategoryById = async (chinh_nha_chi_tiet_id: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const baiVietCategory = await axios.get(`${SERVER_URI}/bai-viet-category/${chinh_nha_chi_tiet_id}`);

      if (!baiVietCategory) return null;
      return {
        code: 200,
        data: baiVietCategory.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getDichVuKhac = async (chinh_nha_chi_tiet_id: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const dichVuKhac = await axios.get(`${SERVER_URI}/dich-vu-khac/${chinh_nha_chi_tiet_id}`);
      if (!dichVuKhac) return null;
      return {
        code: 200,
        data: dichVuKhac.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const formatDate = (isoDateString: any) => {
  const date = new Date(isoDateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

export const formatMoney = (amount: any) => {
  amount = parseFloat(amount.toString().replace(/,/g, '')).toFixed(0);

  if (amount === '') {
    return '';
  }

  let formatted = '';
  let count = 0;

  for (let i = amount.length - 1; i >= 0; i--) {
    formatted = amount[i] + formatted;
    count++;

    if (count % 3 === 0 && i > 0) {
      formatted = '.' + formatted;
    }
  }

  formatted += 'đ';
  return formatted;
}