import { useMutation, useQuery } from '@tanstack/react-query';
import { WorkingHours, WorkingHoursCreateDto } from '../../models';
import workingHoursService from '../../services/working_hours.service';

export const useCreateWorkingHours = () => {
    return useMutation({
        mutationFn: (workingHours: WorkingHoursCreateDto) =>
            workingHoursService.createWorkingHours(workingHours),
    });
};

export const useUpdateWorkingHours = () => {
    return useMutation({
        mutationFn: (workingHours: WorkingHours) =>
            workingHoursService.updateWorkingHours(workingHours),
    });
};

export const useDeleteWorkingHours = () => {
    return useMutation({
        mutationFn: (id: number) => workingHoursService.deleteWorkingHours(id),
    });
};

export const useGetWorkingHoursByClinicId = (clinicId: number | null) => {
    return useQuery({
        queryKey: ['useGetWorkingHoursByClinicId', clinicId],
        queryFn: () => workingHoursService.getWorkingHoursByClinicId(clinicId),
        retry: false,
    });
};
