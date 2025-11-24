import axios from "axios";
import { toast } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  // Do not send Authorization for the auth code exchange endpoint
  const url = (config.baseURL || '') + (config.url || '');
  const isExchange = url.includes('/api/auth/exchange');
  if (token && !isExchange) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi token hết hạn hoặc không hợp lệ
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try to refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authData = sessionStorage.getItem('authData');
        if (authData) {
          const { refreshToken } = JSON.parse(authData);
          
          if (refreshToken) {
            // Call refresh token endpoint
            const { data } = await axios.post(
              `${BACKEND_URL}/api/auth/refresh`,
              { refreshToken },
              { withCredentials: true }
            );

            if (data && data.data.accessToken) {
              // Update tokens in session storage
              sessionStorage.setItem('token', data.data.accessToken);
              const updatedAuthData = JSON.parse(sessionStorage.getItem('authData'));
              updatedAuthData.accessToken = data.data.accessToken;
              if (data.data.idToken) updatedAuthData.idToken = data.data.idToken;
              sessionStorage.setItem('authData', JSON.stringify(updatedAuthData));

              // Retry the original request with new token
              originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
              return axiosInstance(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // If 401/403 and refresh failed or not applicable, logout
    if (status === 401 || status === 403) {
      sessionStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;
