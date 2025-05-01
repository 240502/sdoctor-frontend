import apiClient from '../constants/api';

const patientProfileService = {
    async createPatientProfile(data: any): Promise<any> {
        const res: any = await apiClient.post('/patient-profile/create', data);
        return res;
    },
    async updatePatientProfile(data: any): Promise<any> {
        const res: any = await apiClient.put('/patient-profile/update', data);
        return res;
    },
    async deletePatientProfile(uuid: any): Promise<any> {
        const res = await apiClient.delete('/patient-profile/delete/' + uuid);
        return res;
    },
    async getPatientProfileByUuid(uuid: string): Promise<any> {
        const res = await apiClient.get('/patient-profile/get-by-uuid/' + uuid);
        return res.data;
    },
    async getProfileByPhoneOrEmail(data: any): Promise<any> {
        const res = await apiClient.post(
            '/patient-profile/get-by-phone-or-email',
            data
        );
        return res.data;
    },
};
export default patientProfileService;
