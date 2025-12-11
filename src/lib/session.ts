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
        // payload.data is where we stored ICredentials (which has user) based on the encrypt call { data }
        // The user example had: return payload.data as IUser. 
        // But payload.data is ICredentials. Let's check structure.
        // createSession({ data }) -> encrypt({ data }) -> payload has .data
        // So payload.data is ICredentials.
        // ICredentials has .user which is IUser.
        // If user wants getUserAuth to return IUser, it should be payload.data.user
        // However, the snippet says: return payload.data as IUser
        // Let's assume the snippet meant payload.data.user OR payload.data IS IUser.
        // Looking at snippet: data: ICredentials passed to createSession.
        // So payload.data is ICredentials.
        // snippet: return payload.data as IUser.
        // This implies ICredentials might be compatible with IUser or there's a mismatch in the snippet.
        // My ICredentials: { token, user: IUser }.
        // So payload.data is { token, user }.
        // If I return payload.data as IUser, checking if that's valid.
        // IUser: { id, username, role... }
        // I will stick to returning the full credentials or the user?
        // The snippet returns `payload.data as IUser`.
        // I will adjust the return to `(payload.data as unknown as ICredentials).user` to be safe and logical, 
        // OR if the user implementation implies ICredentials == IUser (unlikely given token).
        // I'll strictly follow the snippet but with type safety adaptation:
        // Actually, looking at the snippet:
        // export async function getUserAuth() { ... return payload.data as IUser }
        // If payload.data IS ICredentials, this cast might be wrong if ICredentials != IUser.
        // I will assume the user wants the User object. I will access .user if it exists.

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
