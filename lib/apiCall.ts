// api/apiService.js

import axios from "axios";
import { URL } from "@/context/GlobalProvider";

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
