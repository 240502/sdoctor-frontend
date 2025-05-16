import { useMutation, useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services';

export const useDeleteDoctor = () => {
    return useMutation({
        mutationFn: (doctorId: number | null) =>
            doctorService.deleteDoctor(doctorId),
    });
};
