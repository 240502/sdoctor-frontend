import apiClient from '../constants/api';

const educationService = {
    async getEducationByDoctorId(doctorId: number | null): Promise<any> {
        const res = await apiClient.get(
            '/education/get-education-by-doctorId/' + doctorId
        );
        return res?.data;
    },
    async createEducation(payload: any): Promise<any> {
        const res = await apiClient.post('/education/create', payload);
        return res?.data;
    },
};
export default educationService;
