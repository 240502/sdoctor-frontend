import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../services';

const useFetchServiceByDepartment = (departmentId: number | null) => {
    return useQuery({
        queryKey: ['useFetchServiceByDepartment', departmentId],
        queryFn: async () =>
            serviceService.getServiceByDepartmentId(departmentId),
    });
};

const useFetchServiceByDepartmentAndDoctor = (payload: {
    department: number;
    doctorId: number;
}) => {
    return useQuery({
        queryKey: ['useFetchServiceByDepartmentAndDoctor', payload],
        queryFn: () =>
            serviceService.getServiceByDepartmentAndDoctor(
                payload.department,
                payload.doctorId
            ),
    });
};
export { useFetchServiceByDepartment, useFetchServiceByDepartmentAndDoctor };
