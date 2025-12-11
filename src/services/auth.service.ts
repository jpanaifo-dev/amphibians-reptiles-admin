import { API_ROUTES } from '@/config/api-routes';
import { httpClient } from '@/lib/api-client';

// Define Interfaces for Request/Response
export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        return httpClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    },

    register: async (data: unknown) => {
        return httpClient.post(API_ROUTES.AUTH.REGISTER, data);
    },

    getProfile: async () => {
        return httpClient.get(API_ROUTES.AUTH.ME);
    },
};
