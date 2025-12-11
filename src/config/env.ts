import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000/api'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    SESSION_SECRET: z.string().min(32),
});

const parsedEnv = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
});

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
}

export const ENV = parsedEnv.data;
