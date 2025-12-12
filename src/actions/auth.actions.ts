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

        // 3. Create Session (Success path - checks for direct properties)
        if (response.token && response.user) {
            await createSession(response);
            // 5. Redirect on Success
            redirect(APP_ROUTES.ADMIN.ROOT);
        }

        // Return error if response format is invalid
        return { message: 'Invalid server response.' };

    } catch (error) {
        if (ApiError.isApiError(error)) {
            return { message: error.message };
        }
        return { message: 'Something went wrong.' };
    }


}
