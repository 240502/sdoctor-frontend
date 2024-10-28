import { Functions } from './functions';

export interface User {
    id: Number;
    full_name: String;
    image: String;
    phone: String;
    gender: String;
    address: String;
    email: String;
    password: String;
    role_id: Number;
    created_at: Date;
    updated_at: Date;
    created_by_user_id: Number;
    birthday: Date;
    token: string;
    functions: Functions[];
    object_id: number;
}
