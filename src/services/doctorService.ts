import { apiClient } from '../constants/api';

export const doctorService = {
    async getDoctorByUserId(userId: number): Promise<any> {
        console.log();
        const res: any = await apiClient.get(
            '/api/doctor/get-by-user-id/' + userId
        );
        return res?.data;
    },
    async getCommonDoctor(data: any): Promise<any> {
        const res: any = await apiClient.post(
            '/api/doctor/get-common-doctor',
            data
        );
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
    async updateViewsDoctor(id: number): Promise<any> {
        const res: any = await apiClient.put(
            '/api/doctor/update-views-doctor/' + id
        );
        return res;
    },

    async createDoctor(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/api/doctor/create', data, config);
        return res;
    },
    async updateDoctor(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/api/doctor/update', data, config);
        return res;
    },
    async deleteDoctor(id: any, config: any): Promise<any> {
        const res = await apiClient.delete('/api/doctor/delete/' + id, config);
        return res;
    },
};
