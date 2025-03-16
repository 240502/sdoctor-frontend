export interface Functions {
    id: number;
    function_name: string;
    created_at: Date | null;
    updated_at: Date | null;
    parent_id: number | null;
    icon: string;
    link: string | null;
    sort: string | null;
}
