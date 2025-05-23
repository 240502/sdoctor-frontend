export interface MedicalPackage {
    id: number;
    name: string;
    summary: string;
    price: number;
    clinicId: number;
    categoryId: number;
    image: string;
    preparationProcess: string;
    views: number;
    serviceDetail: string;
    categoryName: string;
    location: string;
    clinicName: string;
    coverImage: string;
}

interface Pagination {
    pageIndex?: number;
    pageSize?: number ;
}
export interface MedicalPackageOptions extends Pagination {
    clinicId?: number | null;
    categoryIds?: number[] | null;
    startPrice?: number | null;
    endPrice?: number | null;
    location?: string | null;
}
