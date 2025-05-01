import apiClient from '../constants/api';

const timeService = {
    async getTimeById(id: number): Promise<any> {
        const res = await apiClient.get('/api/time/get-by-id/' + id);
        return res.data;
    },
    async getTimeByTimeType(data: any): Promise<any> {
        const res = await apiClient.post('/time/get-by-type', data);
        return res.data;
    },
};
export default timeService;
