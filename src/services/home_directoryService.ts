import { apiClient } from '../constants/api';

export const HomeDirectoryService = {
    async getHomeDirectory(): Promise<any> {
        const res: any = await apiClient.get(
            '/api/home-directory/get-home-directory'
        );
        return res?.data;
    },
};
