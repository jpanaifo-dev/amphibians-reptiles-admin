'use server';

import { authService, LoginRequest } from '@/services/auth.service';
import { ApiError } from '@/lib/api-errors';
import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/config/app-routes';

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Missing credentials' };
    }

    try {
        const response = await authService.login({ email, password });

        // In a real app, you would set the cookie here
        // cookies().set('token', response.token);
        console.log('Login successful:', response.user);

    } catch (error) {
        if (ApiError.isApiError(error)) {
            return { error: error.message }; // Return friendly error message
        }
        return { error: 'Something went wrong' };
    }

    // Redirect on success
    redirect(APP_ROUTES.DASHBOARD.ROOT);
}
