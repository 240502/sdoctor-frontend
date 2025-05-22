import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { userService } from '../services';
import { RefreshTokenResponse } from '../models';

// Mở rộng kiểu AxiosRequestConfig để thêm _retry
declare module 'axios' {
    interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

export const baseURL = 'http://localhost:400/';

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

const apiClient = axios.create({
    baseURL: baseURL + 'api',
    timeout: 1000 * 60 * 30 * 3, // 90 phút
    withCredentials: true, // Cho phép gửi/nhận cookie
});

// Thêm interceptor để xử lý response
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig;

        // Kiểm tra nếu là lỗi 401 và request chưa được retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh, đưa request vào queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => apiClient(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true; // Đánh dấu request đã được retry
            isRefreshing = true;

            try {
                // Gọi API refresh token

                const response: RefreshTokenResponse =
                    await userService.refreshToken();
                localStorage.setItem('user', JSON.stringify(response.result));
                processQueue(null);
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token thất bại, xóa queue và redirect
                processQueue(refreshError as AxiosError);
                // Chỉ redirect nếu không phải đang ở trang login
                if (
                    window.location.pathname !== '/login' &&
                    window.location.pathname === '/admin'
                ) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Nếu không phải lỗi 401 hoặc đã retry, reject error
        return Promise.reject(error);
    }
);

export default apiClient;
