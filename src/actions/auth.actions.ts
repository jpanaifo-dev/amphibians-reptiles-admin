'use server';

import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api-errors';
import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/config/app-routes';
import { LoginSchema } from '@/lib/definitions';
import { createSession } from '@/lib/session';

export type FormState = {
    errors?: {
        username?: string[];
        password?: string[];
        _form?: string[];
    };
    message?: string;
} | undefined;

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
    // 1. Validate Fields with Zod
    const validatedFields = LoginSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Login.',
        };
    }

    const { username, password } = validatedFields.data;

    try {
        // 2. Call API Service
        const response = await authService.login({ username, password });

        // 3. Handle Business Logic based on Response Status
        if (response.status !== 200 || !response.data) {
            // Map API errors to form state
            return {
                message: response.errors?.[0] || 'Invalid credentials',
                errors: {
                    _form: response.errors
                }
            };
        }

        // 4. Create Session
        if (response.data) {
            await createSession(response.data);
        }

    } catch (error) {
        if (ApiError.isApiError(error)) {
            return { message: error.message };
        }
        return { message: 'Something went wrong.' };
    }

    // 5. Redirect on Success
    redirect(APP_ROUTES.ADMIN.ROOT);
}
