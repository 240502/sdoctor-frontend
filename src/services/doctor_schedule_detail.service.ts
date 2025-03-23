import { apiClient } from '../constants/api';

const doctorScheduleDetailService = {
    async getScheduleDetailByScheduleId(scheduleId: number): Promise<any> {
        const res = await apiClient.get(
            '/api/schedule-details/get-by-schedule-id/' + scheduleId
        );
        return res.data;
    },
    async updateAvailableScheduleDetail(
        scheduleDetailId: number
    ): Promise<any> {
        const res = await apiClient.put(
            '/doctor-schedule-detail/update-available/' + scheduleDetailId
        );
        return res;
    },
};
export default doctorScheduleDetailService;
