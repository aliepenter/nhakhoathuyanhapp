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

export const getTrending = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/videos/only-trending`);
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


export const getOnlyLoiDanVideo = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/videos/only-loi-dan`);
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

export const getOnlyPosts = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/posts/only-posts`);
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

export const getOnlySale = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/posts/only-sale`);
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

export const getOnlyLoiDan = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/posts/only-loi-dan`);
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


export const getFaq = async () => {
  try {
    const response = await axios.get(`${SERVER_URI}/faq`);
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

export const getAllAccount = async (username: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const acc = await axios.get(`${SERVER_URI}/users/find-by-phone/${username}`);
      if (!acc) return null;
      return {
        code: 200,
        data: acc.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
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

export const getChinhNhaByLoiDan = async (id: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const chinhNha = await axios.get(`${SERVER_URI}/chinh-nha/by-loi-dan/${id}`);
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

export const getHopDong = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const hopDong = await axios.get(`${SERVER_URI}/hop-dong/${userId}`);
      if (!hopDong) return null;
      return {
        code: 200,
        data: hopDong.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
};


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

export const getDichVuKhacByUserId = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const dichVuKhac = await axios.get(`${SERVER_URI}/dich-vu-khac/by-user/${userId}`);
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

export const getLichHenByUserId = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${SERVER_URI}/lich-hen/by-user/${userId}`);
      if (!res) return null;
      return {
        code: 200,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getMessages = async (cuoc_tro_chuyen_id: number) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${SERVER_URI}/messages/${cuoc_tro_chuyen_id}`);
      if (!res) return null;
      return {
        code: 200,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}
// Customer library
// GET
export const getCustomerLibrary = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const customerLibrary = await axios.get(`${SERVER_URI}/customer-library/${userId}`);
      if (!customerLibrary) return null;
      return {
        code: 200,
        data: customerLibrary.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}
// POST CREATE
export const createCustomerLibrary = async (data: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post(`${SERVER_URI}/customer-library`, data);

      return {
        code: 200,
        data: response.data,
      };
    } catch (error: any) {
      throw error;
    }
  } else {
    return null;
  }
}
// PUT UPDATE
export const updateCustomerLibrary = async (id: number | null, data: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put(`${SERVER_URI}/customer-library/${id}`, data);
      return {
        code: 200,
        data: response.data,
      };
    } catch (error: any) {
      throw error;
    }
  } else {
    return null;
  }
};

export const createDatLich = async (data: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post(`${SERVER_URI}/dat-lich`, data);

      return {
        code: 200,
        data: response.data,
      };
    } catch (error: any) {
      throw error;
    }
  } else {
    return null;
  }
}
// PUT UPDATE AVATAR
export const updateAvatar = async (id: number | null, data: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put(`${SERVER_URI}/avatar/${id}`, data);
      return {
        code: 200,
        data: response.data,
      };
    } catch (error: any) {
      throw error;
    }
  } else {
    return null;
  }
};

// PUT UPDATE MAIN STATUS USER
export const updateMainStatus = async (id: number | null) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put(`${SERVER_URI}/users/update-main-status/${id}`);
      return {
        code: 200,
        data: response.data,
      };
    } catch (error: any) {
      throw error;
    }
  } else {
    return null;
  }
};


export const getAnhQuaTrinh = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const anhQuaTrinh = await axios.get(`${SERVER_URI}/qua-trinh-image/user/${userId}`);
      if (!anhQuaTrinh) return null;
      return {
        code: 200,
        data: anhQuaTrinh.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}


export const getHoSoTraGopCn = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${SERVER_URI}/ho-so-tra-gop-cn/${userId}`);
      if (!res) return null;
      return {
        code: 200,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getLichSuThanhToanCn = async (hstgcnid: string) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${SERVER_URI}/lich-su-thanh-toan/${hstgcnid}`);
      if (!res) return null;
      return {
        code: 200,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getLichSuTroChuyen = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${SERVER_URI}/cuoc-tro-chuyen/${userId}`);
      if (!res) return null;
      return {
        code: 200,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const seenCuocTroChuyen = async (id: number | null, data: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put(`${SERVER_URI}/cuoc-tro-chuyen/${id}`, data);
      return {
        code: 200,
        data: response.data,
      };
    } catch (error: any) {
      throw error;
    }
  } else {
    return null;
  }
};


export const getLoiDan = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${SERVER_URI}/loi-dan/${userId}`);
      if (!res) return null;
      return {
        code: 200,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}

export const getAvatar = async (userId: any) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`${SERVER_URI}/avatar/${userId}`);
      if (!res) return null;
      return {
        code: 200,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  } else {
    return null;
  }
}