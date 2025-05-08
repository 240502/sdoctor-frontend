export interface Comment {
    id: number;
    content: number;
    dateBooking: string | undefined;
    doctorId: number;
    starCount: number;
    phone: string;
    fullName: string;
    type: string;
}

export interface CommentCreate {
    content: string;
    fullName: string;
    commentableId: number;
    starCount: number;
    dateBooking: string;
    commentableType: string;
}
