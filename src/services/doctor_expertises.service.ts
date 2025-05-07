import apiClient from '../constants/api';

const doctorExpertisesService = {
    async createDoctorExpertises(): Promise<any> {
        const res = await apiClient.post('/api/doctor-expertises/create');
        return res?.data;
    },
};
export default doctorExpertisesService;
