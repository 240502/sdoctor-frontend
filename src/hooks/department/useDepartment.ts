import { useQuery } from "@tanstack/react-query"
import { departmentSerivce } from "../../services";

const useFetchDepartmentByPagination = (payload: { pageIndex: number; pageSize: number; name:string}) => {
    return useQuery({
        queryKey: ["useFetchDepartmentByPagination", payload],
        queryFn: () => departmentSerivce.getDepartmentsWithPagination(payload),
        retry:false
    })
}

export {useFetchDepartmentByPagination}