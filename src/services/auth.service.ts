import { API_ROUTES } from '@/config/api-routes';
import { httpClient } from '@/lib/api-client';
import { IResposeLogin, LoginFormData } from '@/lib/definitions';

export const authService = {
    login: async (credentials: LoginFormData): Promise<IResposeLogin> => {
        return httpClient.post<IResposeLogin>(API_ROUTES.AUTH.LOGIN, credentials);
    },

    // Placeholder for future implementation if needed
    // register: async (data: unknown) => {
    //   return httpClient.post(API_ROUTES.AUTH.REGISTER, data);
    // },

    // getProfile: async () => {
    //   return httpClient.get(API_ROUTES.AUTH.ME);
    // },
};
