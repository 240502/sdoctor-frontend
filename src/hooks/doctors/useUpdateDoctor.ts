import { useMutation } from '@tanstack/react-query';
import { DoctorUpdateDto } from '../../models';
import { doctorService } from '../../services';

export const useUpdateDoctor = () => {
    return useMutation({
        mutationKey: ['useUpdateDoctor'],
        mutationFn: (newDoctor: DoctorUpdateDto) =>
            doctorService.updateDoctor(newDoctor),
    });
};
