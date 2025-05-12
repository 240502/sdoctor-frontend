import apiClient from '../constants/api';

const doctorExpertisesService = {
    async createDoctorExpertises(payload: any): Promise<any> {
        const res = await apiClient.post(
            '/api/doctor-expertises/create',
            payload
        );
        return res?.data;
    },
};
export default doctorExpertisesService;
