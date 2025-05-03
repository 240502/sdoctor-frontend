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

export interface CreatePostResponse {}

export interface PostCreateDto {
    title: string;
    content: string;
    authorId: number;
    categoryId: number;
    featuredImage: string | null;
}
export interface PostUpdateDto {
    id: number;
    title: string;
    content: string;
    authorId: number;
    categoryId: number;
    featuredImage: string | null;
}
export interface FetchPostPayload {
    searchContent: string;
    categoryId: number | null;
    pageIndex: number;
    pageSize: number;
    status: string;
    authorId: number | null;
}

export interface PostResponse {
    totalItems: number;
    page: number;
    pageSize: number;
    posts: Post[];
    pageCount: number;
    categoryId: number;
    status: string;
    authorId: number;
}
