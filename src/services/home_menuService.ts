import { apiClient } from '../constants/api';

export const HomeMenuService = {
    async getHomeMenu(): Promise<any> {
        const res: any = await apiClient.get('/api/home-menu/get-home-menu');
        return res?.data;
    },
};
