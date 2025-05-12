import apiClient from '../constants/api';

const workExperienceService = {
    async createWorkExperience(payload: any): Promise<any> {
        const res = await apiClient.post('/api/work-experiences/create');
        return res?.data;
    },
};
export default workExperienceService;
