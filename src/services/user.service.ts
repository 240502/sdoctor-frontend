import { apiClient } from '../constants/api';

export const UserService = {
    async login(data: any): Promise<any> {
        const res = await apiClient.post('/user/login', data);
        return res?.data;
    },
    async createUser(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/api/user/create', data, config);
        return res;
    },
    async updateUser(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/api/user/update', data, config);
        return res;
    },
    async deleteUser(id: number, config: any): Promise<any> {
        const res = await apiClient.delete('/api/user/delete/' + id, config);
        return res;
    },
    async viewUser(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/api/user/view', data, config);
        return res?.data;
    },
    async createAccount(data: any, config: any): Promise<any> {
        const res = await apiClient.post(
            '/api/user/create-account',
            data,
            config
        );
        return res?.data;
    },
    async updateUserActiveStatus(data: any, config: any): Promise<any> {
        const res = await apiClient.put(
            '/api/user/update-active',
            data,
            config
        );
        return res?.data;
    },
    async resetPassword(data: any, config: any): Promise<any> {
        const res = await apiClient.put(
            '/api/user/reset-password',
            data,
            config
        );
        return res?.data;
    },
    async getById(id: number): Promise<any> {
        const res = await apiClient.get('/api/user/getById/' + id);
        return res?.data;
    },
    async changePassword(data: any, config: any): Promise<any> {
        const res = await apiClient.put(
            '/api/user/change-password',
            data,
            config
        );
        return res;
    },
};
