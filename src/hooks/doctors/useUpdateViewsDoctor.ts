import { useMutation } from '@tanstack/react-query';
import { doctorService } from '../../services';

const useUpdateViewsDoctor = () => {
    return useMutation({
        mutationFn: async (doctorId: number) => {
            return await doctorService.updateViewsDoctor(doctorId);
        },
        onSuccess: (data: any) => {
            console.log('data updated successfully', data);
        },
    });
};
export default useUpdateViewsDoctor;
