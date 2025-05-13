import apiClient from '../constants/api';

const workExperienceService = {
    async getWorkExperienceByDoctorId(doctorId: number | null): Promise<any> {
        const res = await apiClient.get(
            '/work-experiences/get-work-experience-by-doctorId/' + doctorId
        );
        return res?.data;
    },
    async createWorkExperience(payload: any): Promise<any> {
        const res = await apiClient.post('/work-experiences/create', payload);
        return res?.data;
    },
};
export default workExperienceService;
