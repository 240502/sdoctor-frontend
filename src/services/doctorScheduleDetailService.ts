import { apiClient, nestApi } from '../constants/api';

export const doctorScheduleDetailService = {
    async getScheduleDetailByScheduleId(scheduleId: number): Promise<any> {
        const res = await nestApi.get(
            '/api/schedule-details/get-by-schedule-id/' + scheduleId
        );
        return res.data;
    },
    async updateAvailableScheduleDetail(
        scheduleDetailId: number
    ): Promise<any> {
        const res = await nestApi.put(
            '/doctor-schedule-detail/update-available/' + scheduleDetailId
        );
        return res;
    },
};
