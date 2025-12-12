import { LoginForm } from '@/components/auth/login-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Admin Panel',
    description: 'Secure access to the administration panel',
};

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
