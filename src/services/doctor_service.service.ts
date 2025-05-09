import apiClient from '../constants/api';

const doctorServiceService = {
    async getAll(): Promise<any> {
        const res = await apiClient.get('/doctor-service/get-all');
        return res?.data;
    },
};
export default doctorServiceService;
