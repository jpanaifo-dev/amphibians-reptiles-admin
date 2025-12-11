export const APP_ROUTES = {
    HOME: '/',
    ADMIN: '/admin',
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
    },
    DASHBOARD: {
        ROOT: '/dashboard',
        USERS: '/dashboard/users',
        PROFILE: '/dashboard/profile',
        USER_DETAILS: (id: string) => `/dashboard/users/${id}`,
    },
} as const;
