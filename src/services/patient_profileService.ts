import { apiClient } from '../constants/api';

export const PatientProfileService = {
    async createPatientProfile(data: any): Promise<any> {
        const res: any = await apiClient.post(
            '/api/patient-profile/create',
            data
        );
        return res;
    },
};
