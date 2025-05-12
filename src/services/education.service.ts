import apiClient from '../constants/api';

const educationService = {
    async createEducation(payload: any): Promise<any> {
        const res = await apiClient.post('/api/education/create', payload);
        return res?.data;
    },
};
export default educationService;
