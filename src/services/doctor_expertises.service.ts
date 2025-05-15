import apiClient from '../constants/api';

const doctorExpertisesService = {
    async getDoctorExpertisesByDoctorId(doctorId: number | null): Promise<any> {
        const res = await apiClient.get(
            '/doctor-expertises/get-expertises-by-doctorId/' + doctorId
        );
        return res?.data;
    },
    async createDoctorExpertises(payload: any): Promise<any> {
        const res = await apiClient.post('/doctor-expertises/create', payload);
        return res?.data;
    },
    async updateDoctorExpertise(payload: any): Promise<any> {
        const res = await apiClient.put('/doctor-expertises/update', payload);
        return res?.data;
    },
    async deleteDoctorExpertise(id: number | null): Promise<any> {
        const res = await apiClient.delete('/doctor-expertises/delete/' + id);
        return res?.data;
    },
};
export default doctorExpertisesService;
