import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { userService } from '../services';

// Mở rộng kiểu InternalAxiosRequestConfig để thêm thuộc tính _retry
declare module 'axios' {
    interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

export const baseURL = 'http://localhost:400/';

const apiClient = axios.create({
    baseURL: baseURL + 'api',
    timeout: 1000 * 60 * 30 * 3, // 90 phút
    withCredentials: true, // Cho phép gửi/nhận cookie
});

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue: any[] = [];

// Hàm xử lý queue các request thất bại
const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (!error) {
            prom.resolve();
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

// Interceptor xử lý response
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | InternalAxiosRequestConfig
            | undefined;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true; // Đánh dấu để tránh loop vô hạn

            if (isRefreshing) {
                // Nếu đang refresh, thêm request vào queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => apiClient(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                // Gọi refresh token
                await userService.refreshToken();
                // Không cần set localStorage hoặc header, server đã set cookie
                // Xử lý các request trong queue
                processQueue(null);
                // Thử lại request ban đầu
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token thất bại, xóa cookie và chuyển hướng
                processQueue(refreshError);
                document.cookie =
                    'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Xóa cookie
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
