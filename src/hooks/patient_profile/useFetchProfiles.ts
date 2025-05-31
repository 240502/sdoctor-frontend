import { useMutation, useQuery } from '@tanstack/react-query';
import { patientProfileService } from '../../services';

export const useFetchProfiles = (uuids: string[]) => {
    return useQuery({
        queryKey: ['useFetchProfiles', uuids],
        queryFn: () => patientProfileService.getPatientProfiles(uuids),
        retry: false,
    });
};

export const useDeletePatientProfile = () => {
    return useMutation({
        mutationKey: ['useDeletePatientProfile'],
        mutationFn: (uuid: string) =>
            patientProfileService.deletePatientProfile(uuid),
    });
};
