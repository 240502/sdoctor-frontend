import { apiClient } from '../constants/api';

export const ServiceCategoryService = {
    async getAll(): Promise<any> {
        const res = await apiClient.get('/service-category/get-all');
        return res.data;
    },
};
