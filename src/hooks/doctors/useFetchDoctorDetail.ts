import { useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../../services';

export const useFetchDoctorDetail = (doctorId: number | null) => {
    // const queryClient = useQueryClient();
    // const doctorsResponse: any = queryClient.getQueryData([
    //     'fetchDoctorsWithPaginationAndFilters',
    //     JSON.stringify({}),
    // ]);
    // if (doctorsResponse) {
    //     const doctor = doctorsResponse.pages[0].data.find(
    //         (item: Doctor) => item.doctorId === doctorId
    //     );
    //     console.log('doctor', doctor);

    //     if (doctor) {
    //         return doctor;
    //     }
    // }

    return useQuery({
        queryKey: ['useFetchDoctorDetail', JSON.stringify(doctorId)],
        queryFn: async () => {
            return await doctorService.getDoctorById(doctorId);
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? [],
    });
};
