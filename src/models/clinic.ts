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
