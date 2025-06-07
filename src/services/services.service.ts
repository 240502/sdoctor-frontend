import apiClient from '../constants/api';

const serviceService = {
    async getAll(): Promise<any> {
        const res = await apiClient.get('/doctor-service/get-all');
        return res?.data;
    },
    async getServiceByDepartmentId(departmentId: number | null): Promise<any> {
        const res = await apiClient.get(
            `/service/get-by-department/${departmentId}`
        );
        return res?.data;
    },
    async getServiceByDepartmentAndDoctor(
        department: number,
        doctorId: number
    ): Promise<any> {
        const res = await apiClient.get(
            `/service/get-by-department-doctor?department=${department}&doctorId=${doctorId}`
        );
        return res?.data;
    },
};
export default serviceService;
