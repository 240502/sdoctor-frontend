import { useMutation, useQuery } from '@tanstack/react-query';
import {
    SupportStaffCreateDTO,
    SupportStaffUpdateDTO,
} from '../../models/support_staff';
import { supportStaffService } from '../../services/support_staff.service';

export const useCreateSupportStaff = () => {
    return useMutation({
        mutationKey: ['useCreateSupportStaff'],
        mutationFn: (supportStaff: SupportStaffCreateDTO) =>
            supportStaffService.createSupportStaff(supportStaff),
    });
};

export const useUpdateSupportStaff = () => {
    return useMutation({
        mutationKey: ['useUpdateSupportStaff'],
        mutationFn: (supportStaff: SupportStaffUpdateDTO) =>
            supportStaffService.updateSupportStaff(supportStaff),
    });
};

export const useDeleteSupportStaff = () => {
    return useMutation({
        mutationKey: ['useDeleteSupportStaff'],
        mutationFn: (id: number | null) =>
            supportStaffService.deleteSupportStaff(id),
    });
};

export const useFetchSupportStaffs = (payload: {
    pageIndex: number;
    pageSize: number;
    searchContent?: string | null;
}) => {
    return useQuery({
        queryKey: ['useFetchSupportStaffs', payload],
        queryFn: () => supportStaffService.getSupportStaffs(payload),
        select: (response) => ({
            supportStaffs: response.data,
            pageCount: response.pageCount,
        }),
        retry: false,
    });
};

export const useFetchSupportStaffById = (employeeId: string | null) => {
    return useQuery({
        queryKey: ['useFetchSupportStaffById', employeeId],
        queryFn: async () => {
            if (!employeeId) {
                throw new Error('employeeId is null');
            }
            return await supportStaffService.getSupportStaffById(employeeId);
        },
        retry: false,
    });
};
