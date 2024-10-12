import { apiClient } from '../constants/api';

export const UserService = {
    async login(data: any) {
        const res = await apiClient.post('/api/user/login', data);
        return res?.data;
    },
};
