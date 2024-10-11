import { apiClient } from '../constants/api';

export const CategoryServicesService = {
    async getAllCategoryServices(): Promise<any> {
        const res = await apiClient.get('/api/category-services/get-all');
        return res.data;
    },
};
