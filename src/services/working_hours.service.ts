import apiClient from '../constants/api';
import { WorkingHours, WorkingHoursCreateDto } from '../models';

const workingHoursService = {
    async createWorkingHours(data: WorkingHoursCreateDto): Promise<any> {
        const res = await apiClient.post('/working-hours/create', data);
        return res;
    },
    async updateWorkingHours(data: WorkingHours): Promise<any> {
        const res = await apiClient.put('/working-hours/update', data);
        return res;
    },
    async deleteWorkingHours(id: number): Promise<any> {
        const res = await apiClient.delete('/working-hours/delete/' + id);
        return res;
    },

    async getWorkingHoursByClinicId(clinicId: number): Promise<any> {
        const res = await apiClient.get(
            '/working-hours/get-working-hours-by-clinicid/' + clinicId
        );
        return res;
    },
};
export default workingHoursService;
