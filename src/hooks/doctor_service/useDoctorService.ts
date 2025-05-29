import { useMutation, useQuery } from '@tanstack/react-query';
import {
    DoctorServiceCreateDTO,
    DoctorServiceUpdateDTO,
} from '../../models/doctor_service';
import { doctorServiceService } from '../../services';

const useCreateDoctorService = () => {
    return useMutation({
        mutationKey: ['useCreateDoctorService'],
        mutationFn: async (doctorService: DoctorServiceCreateDTO) =>
            doctorServiceService.createDoctorService(doctorService),
    });
};

const useUpdateDoctorService = () => {
    return useMutation({
        mutationKey: ['useUpdateDoctorService'],
        mutationFn: async (doctorService: DoctorServiceUpdateDTO) =>
            doctorServiceService.updateDoctorService(doctorService),
    });
};

const useDeleteDoctorService = () => {
    return useMutation({
        mutationKey: ['useDeleteDoctorService'],
        mutationFn: async (id: number | null) =>
            doctorServiceService.deleteDoctorService(id),
    });
};

const useFetchDoctorServicesByDoctorId = (doctorId: number | null) => {
    return useQuery({
        queryKey: ['useFetchDoctorServicesByDoctorId', doctorId],
        queryFn: () => {
            if (doctorId === null) {
                throw new Error('Doctor ID cannot be null');
            }
            return doctorServiceService.getDoctorServiceByDoctorId(doctorId);
        },
        retry: false,
    });
};

export {
    useCreateDoctorService,
    useUpdateDoctorService,
    useDeleteDoctorService,
    useFetchDoctorServicesByDoctorId,
};
