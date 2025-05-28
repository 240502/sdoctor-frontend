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
    async getDepartmentsWithPagination(payload: {
        pageIndex: number;
        pageSize: number;
        name: string
    }): Promise<Department[] | any>{
        const res = await apiClient.get(`/department/get-departments-with-pagination?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}&name=${payload.name}`);
        return res?.data;
    }
};
export default departmentSerivce;
