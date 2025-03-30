import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../../services';
const useCreateDoctor = (config: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newDoctor: any) =>
            doctorService.createDoctor(newDoctor, config),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctors', 1, 10] });
        },
    });
};
export default useCreateDoctor;
