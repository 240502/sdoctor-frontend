export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    publicDate: Date | null;
    updatedAt: Date | null;
    status: string;
    categoryId: number;
    featuredImage: string;
    createdAt: Date | null;
    categoryName: string;
    authorName: string;
    fullName: string;
    image: string;
}
