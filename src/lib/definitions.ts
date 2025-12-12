import { z } from 'zod';

export interface IUser {
    id: string;
    username: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    person?: IPerson;
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

export type IResposeLogin = ICredentials;

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export interface SessionPayload extends ICredentials {
    expiresAt: Date;
}


// ============================================================================
// Additional Types for Services
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
    success?: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/**
 * Query parameters for pagination and search
 */
export interface SearchParams {
    page?: number;
    pageSize?: number;
    limit?: number;
    query?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * User creation data
 */
export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    role?: IUser['role'];
}

/**
 * User update data
 */
export interface UpdateUserData {
    username?: string;
    email?: string;
    role?: IUser['role'];
    status?: IUser['status'];
}

// Type alias for compatibility
export type User = IUser;
