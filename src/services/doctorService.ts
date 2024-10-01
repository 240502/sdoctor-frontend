import { apiClient } from '../constants/api';

export const doctorService = {
    async getCommonDoctor(): Promise<any> {
        const res: any = await apiClient.get('/api/doctor/get-common-doctor');
        return res.data;
    },
};
