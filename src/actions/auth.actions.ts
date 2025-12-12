'use server';

import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api-errors';
import { LoginSchema } from '@/lib/definitions';
import { createSession } from '@/lib/session';

export type FormState = {
    errors?: {
        username?: string[];
        password?: string[];
        _form?: string[];
    };
    message?: string;
    data?: any;
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

        // 3. Create Session (Success path)
        if (response.token && response.user) {
            await createSession(response);

            return {
                message: 'Login successful.',
                data: response
            };
        }

        return { message: 'Invalid server response.' };
    } catch (error) {
        if (ApiError.isApiError(error)) {
            return { message: error.message };
        }
        return { message: 'Something went wrong.' };
    }


}
