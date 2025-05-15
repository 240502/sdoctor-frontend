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
    async updateEducation(payload: any): Promise<any> {
        const res = await apiClient.put('/education/update', payload);
        return res?.data;
    },
    async deleteEducation(id: number): Promise<any> {
        const res = await apiClient.delete('/education/delete/' + id);
        return res?.data;
    },
};
export default educationService;
