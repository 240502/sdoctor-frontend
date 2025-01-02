export interface Functions {
    id: number;
    functionName: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    parentId: number | null;
    icon: string;
    link: string | null;
    sort: string | null;
}
