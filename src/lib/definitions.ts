import { z } from 'zod';

export interface IUser {
    id: string;
    username: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPerson {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    image: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    cti_vitae: string;
}

export interface ICredentials {
    token: string;
    user: IUser;
}

export interface IResposeLogin {
    status: number;
    data?: ICredentials;
    errors?: string[];
}

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export interface SessionPayload extends ICredentials {
    expiresAt: Date;
}
