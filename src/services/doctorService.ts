import { apiClient } from '../constants/api';

export const doctorService = {
    async getCommonDoctor(data: any): Promise<any> {
        const res: any = await apiClient.post(
            '/api/doctor/get-common-doctor',
            data
        );
        return res.data;
    },
};
