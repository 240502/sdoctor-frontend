import { apiClient } from '../constants/api';

export const PatientProfileService = {
    async createPatientProfile(data: any): Promise<any> {
        const res: any = await apiClient.post(
            '/api/patient-profile/create',
            data
        );
        return res;
    },
    async updatePatientProfile(data: any): Promise<any> {
        const res: any = await apiClient.put(
            '/api/patient-profile/update',
            data
        );
        return res;
    },
    async deletePatientProfile(phone: any): Promise<any> {
        const res = await apiClient.delete(
            '/api/patient-profile/delete/' + phone
        );
        return res;
    },
    async getPatientProfileByUuid(uuid: string): Promise<any> {
        const res = await apiClient.get(
            '/api/patient-profile/get-by-uuid/' + uuid
        );
        return res.data;
    },
};
