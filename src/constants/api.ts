import axios from 'axios';
import { setRecoil } from 'recoil-nexus';
import {
    authLoadingState,
    isAuthenticatedState,
    userState,
} from '../stores/userAtom';
import { User } from '../models';
import { joinRoom } from '../socket';
export const baseURL = 'http://localhost:400/';
let cachedCsrfToken: string | null = null;

const apiClient = axios.create({
    baseURL: baseURL + 'api',
    timeout: 1000 * 60 * 30 * 3,
    withCredentials: true,
});

async function getCsrfToken(): Promise<string> {
    if (cachedCsrfToken) {
        return cachedCsrfToken;
    }

    try {
        const response = await apiClient.get<{ csrfToken: string }>(
            '/csrf-token'
        );
        cachedCsrfToken = response.data.csrfToken;
        return cachedCsrfToken;
    } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
        throw new Error('Unable to fetch CSRF token');
    }
}

apiClient.interceptors.request.use(
    async (config) => {
        const method = config.method?.toLowerCase() || '';
        if (['post', 'put', 'delete'].includes(method)) {
            const token = await getCsrfToken();
            config.headers['X-CSRF-Token'] = token;
        }
        return config;
    },
    (error) => {
        console.error('Interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor để làm mới CSRF token nếu backend gửi token mới
apiClient.interceptors.response.use(
    (response) => {
        const method = response.config.method?.toLowerCase() || '';
        if (['post', 'put', 'delete'].includes(method)) {
            // Giả sử backend gửi CSRF token mới trong header 'X-CSRF-Token'
            const newCsrfToken = response.headers['x-csrf-token'];
            if (newCsrfToken) {
                cachedCsrfToken = newCsrfToken;
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config as any;
        if (error.response?.stauts === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('Access token expired, attempting to refresh...'); // Debug
            try {
                const response = await axios.post(
                    `${baseURL}api/user/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                const user = response.data.result as User;
                console.log('Refreshed user:', user); // Debug

                // Cập nhật Recoil state
                setRecoil(userState, user);
                setRecoil(isAuthenticatedState, true);
                setRecoil(authLoadingState, false);
                localStorage.setItem('user', JSON.stringify(user));

                // Gọi joinRoom cho Socket.IO
                if (user.userId) {
                    joinRoom(user.userId);
                }

                // Thử lại yêu cầu ban đầu
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                setRecoil(isAuthenticatedState, false);
                setRecoil(userState, {} as User);
                setRecoil(authLoadingState, false);
                localStorage.removeItem('user');

                // Chuyển hướng về login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        if (
            error.response?.status === 403 &&
            error.response?.data?.message === 'Invalid CSRF token'
        ) {
            // Làm mới CSRF token nếu nhận lỗi 403
            cachedCsrfToken = null;
        }
        return Promise.reject(error);
    }
);
export default apiClient;
// export const nestJsServiceUrl = 'http://localhost:9999';
// export const nestApi = axios.create({
//     baseURL: nestJsServiceUrl,
//     timeout: 1000 * 60,
// });
