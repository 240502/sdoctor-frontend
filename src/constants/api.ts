import axios from 'axios';
export const baseURL = 'http://localhost:400/';
const apiClient = axios.create({
    baseURL: baseURL + 'api',
    timeout: 1000 * 60 * 30 * 3,
    withCredentials: true,
});
async function getCsrfToken(): Promise<string> {
    const cached = localStorage.getItem('csrfToken');
    if (cached) return cached;

    const response = await apiClient.get('/csrf-token');
    const token = response.data.csrfToken;
    localStorage.setItem('csrfToken', token);
    return token;
}

apiClient.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase() || '';
    if (['post', 'put', 'delete'].includes(method)) {
        const token = await getCsrfToken();
        config.headers['X-CSRF-Token'] = token;
    }
    return config;
});
export default apiClient;
// export const nestJsServiceUrl = 'http://localhost:9999';
// export const nestApi = axios.create({
//     baseURL: nestJsServiceUrl,
//     timeout: 1000 * 60,
// });
