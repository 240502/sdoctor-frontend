import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../services';

const useFetchServiceByDepartment = (departmentId: number | null) => {
    return useQuery({
        queryKey: ['useFetchServiceByDepartment', departmentId],
        queryFn: async () =>
            serviceService.getServiceByDepartmentId(departmentId),
    });
};

export { useFetchServiceByDepartment };
