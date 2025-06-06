import apiClient from '../constants/api';

const homeMenuService = {
    async getHomeMenu(): Promise<any> {
        const res: any = await apiClient.get('/home-menu/get-all');
        return res?.data;
    },
};
export default homeMenuService;
