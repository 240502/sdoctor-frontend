import { apiClient } from '../constants/api';

export const doctorService = {
    async getDoctorByUserId(userId: number): Promise<any> {
        console.log();
        const res: any = await apiClient.get(
            '/doctor/get-by-user-id/' + userId
        );
        return res?.data;
    },
    async getCommonDoctor(data: any): Promise<any> {
        const res: any = await apiClient.post(
            '/doctor/get-common-doctor',
            data
        );
        return res.data;
    },
    async viewDoctorForClient(data: any): Promise<any> {
        const res: any = await apiClient.post('/doctor/view-for-client', data);
        return res?.data;
    },
    async viewDoctorForAdmin(data: any): Promise<any> {
        const res: any = await apiClient.post('/doctor/view-for-admin', data);
        return res?.data;
    },
    async getDoctorById(id: number): Promise<any> {
        const res: any = await apiClient.get('/doctor/get-by-id/' + id);
        return res?.data;
    },
    async updateViewsDoctor(id: number): Promise<any> {
        const res: any = await apiClient.put(
            '/doctor/update-doctor-views/' + id
        );
        return res;
    },

    async createDoctor(data: any, config: any): Promise<any> {
        const res = await apiClient.post('/doctor/create', data, config);
        return res;
    },
    async updateDoctor(data: any, config: any): Promise<any> {
        const res = await apiClient.put('/doctor/update', data, config);
        return res;
    },
    async deleteDoctor(id: any, config: any): Promise<any> {
        const res = await apiClient.delete('/doctor/delete/' + id, config);
        return res;
    },
};
