import apiClient from '../constants/api';

const educationService = {
    async createEducation(): Promise<any> {
        const res = await apiClient.post('/api/education/create');
        return res?.data;
    },
};
export default educationService;
