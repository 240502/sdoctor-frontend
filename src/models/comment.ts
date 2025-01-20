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
    doctorId: number;
    content: string;
    fullName: string;
    starCount: number;
    dateBooking: string;
}
