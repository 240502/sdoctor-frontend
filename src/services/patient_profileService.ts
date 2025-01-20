import { apiClient, nestApi } from '../constants/api';

export const PatientProfileService = {
    async createPatientProfile(data: any): Promise<any> {
        const res: any = await nestApi.post('/patient-profile/create', data);
        return res;
    },
    async updatePatientProfile(data: any): Promise<any> {
        const res: any = await nestApi.put('/patient-profile/update', data);
        return res;
    },
    async deletePatientProfile(uuid: any): Promise<any> {
        const res = await nestApi.delete('/patient-profile/delete/' + uuid);
        return res;
    },
    async getPatientProfileByUuid(uuid: string): Promise<any> {
        const res = await nestApi.get('/patient-profile/get-by-uuid/' + uuid);
        return res.data;
    },
    async getProfileByPhoneOrEmail(data: any): Promise<any> {
        const res = await nestApi.post(
            '/patient-profile/get-by-phone-or-email',
            data
        );
        return res.data;
    },
};
