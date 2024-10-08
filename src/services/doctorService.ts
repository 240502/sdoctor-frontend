import { apiClient } from '../constants/api';

export const doctorService = {
    async getCommonDoctor(): Promise<any> {
        const res: any = await apiClient.get('/api/doctor/get-common-doctor');
        return res.data;
    },
    async viewDoctor(data: any): Promise<any> {
        const res: any = await apiClient.post('/api/doctor/view', data);
        return res?.data;
    },
    async getDoctorById(id: number): Promise<any> {
        const res: any = await apiClient.get('/api/doctor/getById/' + id);
        return res?.data;
    },
};
