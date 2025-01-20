import { apiClient, nestApi } from '../constants/api';

export const HomeMenuService = {
    async getHomeMenu(): Promise<any> {
        const res: any = await nestApi.get('/home-menu/get-all');
        return res?.data;
    },
};
