import axios from 'axios';
export const baseURL = 'http://localhost:400/';
export const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 60 * 30 * 3,
});

export const nestJsServiceUrl = 'http://localhost:9999';
export const nestApi = axios.create({
    baseURL: nestJsServiceUrl,
    timeout: 1000 * 60,
});
