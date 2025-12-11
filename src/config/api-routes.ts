/**
 * @file API Routes Constants
 * @description Centralized API endpoints to avoid hardcoded URLs throughout the app.
 * All endpoints are organized by entity/resource.
 * This prevents typos and makes URL changes easier to manage.
 */

import { ENV } from './env';

const BASE_URL = ENV.API_BASE_URL;

/**
 * Immutable object containing all API endpoints
 * @example
 * // Usage:
 * const response = await httpClient.post(API_ROUTES.AUTH.LOGIN, credentials);
 */
export const API_ROUTES = {
    // Authentication endpoints
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        REGISTER: `${BASE_URL}/auth/register`,
        LOGOUT: `${BASE_URL}/auth/logout`,
        ME: `${BASE_URL}/auth/me`,
        REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
        VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
        FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
        RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    },
    
    // User management endpoints
    USERS: {
        GET_ALL: `${BASE_URL}/users`,
        GET_BY_ID: (id: string | number) => `${BASE_URL}/users/${id}`,
        CREATE: `${BASE_URL}/users`,
        UPDATE: (id: string | number) => `${BASE_URL}/users/${id}`,
        DELETE: (id: string | number) => `${BASE_URL}/users/${id}`,
        SEARCH: `${BASE_URL}/users/search`,
    },
    
    // Add more entities as needed
    // POSTS: {...},
    // COMMENTS: {...},
} as const;
