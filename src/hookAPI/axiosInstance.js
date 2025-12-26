import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: process.env.API_URL_TMDB,
});

// Interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    config.params = {
      ...(config.params || {}),
      session_id: process.env.TMDB_SESSION_ID,
      api_key: process.env.API_KEY_TMDB,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
