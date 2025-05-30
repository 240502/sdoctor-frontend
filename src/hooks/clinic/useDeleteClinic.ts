import { useMutation } from '@tanstack/react-query';
import { clinicService } from '../../services';

export const useDeleteClinic = () => {
    return useMutation({
        mutationKey: ['useDeleteClinic'],
        mutationFn: (id: number | null) => clinicService.deleteClinic(id),
    });
};
