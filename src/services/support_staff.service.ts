import { AxiosResponse } from 'axios';
import apiClient from '../constants/api';
import {
    SupportStaff,
    SupportStaffCreateDTO,
    SupportStaffUpdateDTO,
} from '../models/support_staff';

export const supportStaffService = {
    async createSupportStaff(
        supportStaff: SupportStaffCreateDTO
    ): Promise<any> {
        const res = await apiClient.post('/support-staff/create', supportStaff);
        return res;
    },
    async updateSupportStaff(
        supportStaff: SupportStaffUpdateDTO
    ): Promise<any> {
        const res = await apiClient.put('/support-staff/update', supportStaff);
        return res;
    },
    async deleteSupportStaff(id: number | null) {
        const res = await apiClient.delete('/support-staff/delete/' + id);
        return res;
    },
    async getSupportStaffs(payload: {
        pageIndex: number;
        pageSize: number;
        searchContent?: string | null;
    }) {
        const res = await apiClient.get(
            `/support-staff/get-support-staffs?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}&searchContent=${payload.searchContent}`
        );
        return res?.data;
    },
    async getSupportStaffById(employeeId: string): Promise<SupportStaff> {
        const res = await apiClient.get(
            '/support-staff/get-by-id/' + employeeId
        );
        return res?.data;
    },
};
