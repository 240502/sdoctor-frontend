import axios from 'axios';
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
    (error) => {
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
