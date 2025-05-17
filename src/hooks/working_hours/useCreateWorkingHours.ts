import { useMutation } from '@tanstack/react-query';
import { WorkingHoursCreateDto } from '../../models';
import workingHoursService from '../../services/working_hours.service';

export const useCreateWorkingHours = () => {
    return useMutation({
        mutationFn: (workingHours: WorkingHoursCreateDto) =>
            workingHoursService.createWorkingHours(workingHours),
    });
};
