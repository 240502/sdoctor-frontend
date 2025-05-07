import apiClient from '../constants/api';

const educationService = {
    async createEducation(): Promise<any> {
        const res = await apiClient.post('/api/work-experiences/create');
        return res?.data;
    },
};
export default educationService;
