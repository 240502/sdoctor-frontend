import { apiClient } from '../constants/api';

export const scheduleService = {
    async getBySubscriberIdAndDate(data: object): Promise<any> {
        const res = await apiClient.post(
            '/api/schedule/get-by-subscriber-id-date',
            data    
        );
        return res.data;
    },
};
