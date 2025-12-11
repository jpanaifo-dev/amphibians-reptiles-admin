import { API_ROUTES } from '@/config/api-routes';
import { fetchMethods } from '@/lib/api-client';
import { IResposeLogin, LoginFormData } from '@/lib/definitions';

export const authService = {
    login: async (credentials: LoginFormData): Promise<IResposeLogin> => {
        return fetchMethods.post<IResposeLogin>(API_ROUTES.AUTH.LOGIN, credentials);
    },
};
