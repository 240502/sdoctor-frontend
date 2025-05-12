import axios from 'axios';
import { userService } from '../services';
export const baseURL = 'http://localhost:400/';

const apiClient = axios.create({
    baseURL: baseURL + 'api',
    timeout: 1000 * 60 * 30 * 3,
    withCredentials: true,
});

export default apiClient;
// export const nestJsServiceUrl = 'http://localhost:9999';
// export const nestApi = axios.create({
//     baseURL: nestJsServiceUrl,
//     timeout: 1000 * 60,
// });
