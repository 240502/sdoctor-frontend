import { useMutation, useQuery } from '@tanstack/react-query';
import { PatientProfile, PatientProfileCreateDTO } from '../../models';
import { patientProfileService } from '../../services';

const useCreatePatientProfile = () => {
    return useMutation({
        mutationFn: (newProfile: PatientProfileCreateDTO) =>
            patientProfileService.createPatientProfile(newProfile),
    });
};

const useUpdatePatientProfile = () => {
    return useMutation({
        mutationFn: (newProfile: PatientProfileCreateDTO) =>
            patientProfileService.updatePatientProfile(newProfile),
    });
};

const useFetchPatientProfileByPhoneOrEmail = (data: any) => {
    return useQuery({
        queryKey: ['useFetchPatientProfile', data],
        queryFn: () => patientProfileService.getProfileByPhoneOrEmail(data),
    });
};
const useFetchProfileByUuid = (uuid: string) => {
    return useQuery({
        queryKey: ['useFetchProfileByUuid', uuid],
        queryFn: () => patientProfileService.getPatientProfileByUuid(uuid),
    });
};
export {
    useCreatePatientProfile,
    useUpdatePatientProfile,
    useFetchPatientProfileByPhoneOrEmail,
    useFetchProfileByUuid,
};
