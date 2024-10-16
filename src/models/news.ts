export interface News {
    id: number;
    title: string;
    content: string;
    author_id: number;
    public_date: Date | null;
    updated_at: Date | null;
    status: string;
    category_id: number;
    featured_image: string;
    created_at: Date | null;
    category_name: string;
    author_name: string;
}
