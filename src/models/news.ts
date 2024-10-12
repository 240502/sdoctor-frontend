export interface News {
    id: number;
    title: string;
    content: string;
    author_id: number;
    public_date: Date;
    updated_at: Date;
    status: string;
    category_id: number;
}
