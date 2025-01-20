import { apiClient, nestApi } from '../constants/api';

export const ServiceCategoryService = {
    async getAll(): Promise<any> {
        const res = await nestApi.get('/service-category/get-all');
        return res.data;
    },
};
