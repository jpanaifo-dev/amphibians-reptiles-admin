import { ENV } from './env';

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${ENV.NEXT_PUBLIC_API_URL}/auth/login`,
        REGISTER: `${ENV.NEXT_PUBLIC_API_URL}/auth/register`,
        ME: `${ENV.NEXT_PUBLIC_API_URL}/auth/me`,
        REFRESH_TOKEN: `${ENV.NEXT_PUBLIC_API_URL}/auth/refresh`,
    },
    USERS: {
        GET_ALL: `${ENV.NEXT_PUBLIC_API_URL}/users`,
        GET_BY_ID: (id: string) => `${ENV.NEXT_PUBLIC_API_URL}/users/${id}`,
        CREATE: `${ENV.NEXT_PUBLIC_API_URL}/users`,
        UPDATE: (id: string) => `${ENV.NEXT_PUBLIC_API_URL}/users/${id}`,
        DELETE: (id: string) => `${ENV.NEXT_PUBLIC_API_URL}/users/${id}`,
    },
} as const;
