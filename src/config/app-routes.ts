/**
 * @file App Internal Routes
 * @description Centralized internal navigation paths for the application.
 * Use these constants instead of hardcoding paths in <Link> or redirect().
 * This prevents routing errors and makes refactoring easier.
 */

/**
 * Immutable object containing all internal app routes
 * @example
 * // Usage in Link:
 * <Link href={APP_ROUTES.AUTH.LOGIN}>Login</Link>
 * 
 * // Usage in redirect:
 * redirect(APP_ROUTES.DASHBOARD.ADMIN);
 */
export const APP_ROUTES = {
    HOME: '/',

    // Authentication routes
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/sign-in', // matches your FrmLogin component link
        LOGOUT: '/logout',
    },
    ADMIN: {
        ROOT: '/admin',
    },
    // Dashboard routes
    DASHBOARD: {
        // Admin dashboard
        ADMIN: '/admin',

        // Basic user dashboard
        USER: '/user',

        // General dashboard
        ROOT: '/dashboard',
        USERS: '/dashboard/users',
        PROFILE: '/dashboard/profile',
        SETTINGS: '/dashboard/settings',

        // Dynamic routes
        USER_DETAILS: (id: string | number) => `/dashboard/users/${id}`,
    },
} as const;
