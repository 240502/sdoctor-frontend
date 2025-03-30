export interface Clinic {
    id: number;
    name: string;
    description: string;
    location: string;
    avatar: string;
    coverImage: string;
    createdAt: Date;
    updatedAt: Date;
    majorList: number[];
}

export interface Pagination {
    pageIndex?: number;
    pageSize?: number;
}

export interface ClinicOptions extends Pagination {
    location?: string | null;
    departmentIds?: number[];
}
