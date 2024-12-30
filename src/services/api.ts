import axios from 'axios';
import {useAuthStore} from '@/stores/auth';

const baseURL = 'http://localhost:8080';
const tokenPrefix = 'Bearer ';
const api = axios.create({
  baseURL: 'http://localhost:9080', // 백엔드 URL
  withCredentials: true,
});

// 요청 인터셉터: 액세스 토큰 자동 추가
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 액세스 토큰 만료 시 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response
          = await axios.post(`${baseURL}/auth/refresh`, {}, {withCredentials: true});
        const newAccessToken = response.data.accessToken;
        const authStore = useAuthStore();

        authStore.setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      }
    }
    return Promise.reject(error);
  }
);

export default api;
