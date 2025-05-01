import apiClient from '../constants/api';

const appointmentStatusService = {
    async getAll(): Promise<any> {
        const res = await apiClient.get('/appointment-status/get-all');
        return res.data;
    },
};
export default appointmentStatusService;
