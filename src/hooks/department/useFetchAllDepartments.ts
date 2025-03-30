import { useQuery } from '@tanstack/react-query';
import departmentSerivce from '../../services/department.service';

export const useFetchAllDepartments = () => {
    return useQuery({
        queryKey: ['useFetchAllDepartments'],
        queryFn: departmentSerivce.getAllDepartments,
        retry: 1,
        select: (response) => ({
            departments: response.data,
        }),
        placeholderData: (previousData) => previousData ?? [],
    });
};
