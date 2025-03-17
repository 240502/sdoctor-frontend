import { apiClient } from '../constants/api';

export const HomeMenuService = {
    async getHomeMenu(): Promise<any> {
        const res: any = await apiClient.get('/home-menu/get-all');
        return res?.data;
    },
};
