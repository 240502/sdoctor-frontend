import { useQuery } from '@tanstack/react-query';

import { departmentSerivce } from '../../services';

export const useFetchDepartmentByClinicId = (clinicId: number) => {
    return useQuery({
        queryKey: ['useFetchDepartmentByClinicId', JSON.stringify(clinicId)],
        queryFn: async () =>
            await departmentSerivce.getDepartmentByClinicId(clinicId),
    });
};
