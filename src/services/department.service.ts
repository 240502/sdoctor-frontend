import apiClient from '../constants/api';
import { Department } from '../models';

const departmentSerivce = {
    async getAllDepartments(): Promise<Department[] | any> {
        const res = await apiClient.get('/department/get-all-departments');
        return res;
    },
    async getDepartmentByClinicId(
        clinicId: number
    ): Promise<Department[] | any> {
        const res = await apiClient.get(
            '/department/get-department-by-clinicid/' + clinicId
        );
        return res.data;
    },
};
export default departmentSerivce;
