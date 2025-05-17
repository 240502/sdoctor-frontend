import apiClient from '../constants/api';
import { WorkingHoursCreateDto } from '../models';

const workingHoursService = {
    async createWorkingHours(data: WorkingHoursCreateDto): Promise<any> {
        const res = await apiClient.post('/working-hours/create', data);
        return res;
    },
};
export default workingHoursService;
