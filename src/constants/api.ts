import axios from 'axios';
export const baseURL = 'http://localhost:400/';
export const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 60 * 30 * 3,
});
