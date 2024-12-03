export interface Clinic {
    id: number;
    name: string;
    description: string;
    location: string;
    avatar: string;
    cover_image: string;
    created_at: Date;
    updated_at: Date;
    major_list: number[];
}
