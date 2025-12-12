import 'server-only';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { ICredentials, IUser } from '@/lib/definitions';
import { ENV } from '@/config/env';

// Use ENV for type safety and defaults
const APP_NAME = ENV.APP_NAME;
const secretKey = ENV.SESSION_SECRET || 'default_secret_key_at_least_32_chars'; // Fallback if optional
const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload extends JWTPayload {
    data: ICredentials;
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error('Error al decodificar la sesión:', error);
    }
    return null;
}

export async function createSession(
    data: ICredentials,
    expires_at: number = 7 * 24 * 60 * 60 * 1000
) {
    const expiresAt = new Date(Date.now() + expires_at);
    const session = await encrypt({
        data,
    });
    const cookieStore = await cookies();
    cookieStore.set(`${APP_NAME}_session`, session, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production', // Using ENV check implementation
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get(`${APP_NAME}_session`);
    if (!session) return null;
    const payload = await decrypt(session?.value);
    return payload as SessionPayload | null;
}

export async function getUserAuth() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(`${APP_NAME}_session`);
        if (!session?.value) return null;

        const { payload } = await jwtVerify(session?.value, encodedKey, {
            algorithms: ['HS256'],
        });
        const data = payload.data as unknown as ICredentials;
        return data.user;
    } catch (error) {
        console.error('Error al obtener la autenticación del usuario:', error);
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(`${APP_NAME}_session`);
}
