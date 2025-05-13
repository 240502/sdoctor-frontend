import apiClient from '../constants/api';

const doctorExpertisesService = {
    async getDoctorExpertisesByDoctorId(doctorId: number | null): Promise<any> {
        const res = await apiClient.get(
            '/doctor-expertises/get-doctor-expertises-by-doctorId' + doctorId
        );
        return res?.data;
    },
    async createDoctorExpertises(payload: any): Promise<any> {
        const res = await apiClient.post('/doctor-expertises/create', payload);
        return res?.data;
    },
};
export default doctorExpertisesService;
