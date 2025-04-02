import { apiClient } from '../constants/api';

const degreesService = {
    async getAllDegrees(): Promise<any> {
        const res: any = await apiClient.get('/degrees/get-all-degrees');
        return res?.data;
    },
};

export default degreesService;
