

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { MedicalPackage, MedicalPackageOptions } from "../../models";
import { medicalPackageService } from "../../services";


interface PaginatedMedicalPackage {
    medicalPackages: MedicalPackage[];
    pageIndex: number;
    pageCount: number;
    totalItems: number;
}

export const useFetchMedicalPackageForAdmin = (payload: MedicalPackageOptions):UseQueryResult<PaginatedMedicalPackage,Error> => {
    return useQuery<PaginatedMedicalPackage,Error>({
        queryKey: ["useFetchMedicalPackageForAdmin", payload],
        queryFn: () => medicalPackageService.viewService(payload)
        
    })
    
}