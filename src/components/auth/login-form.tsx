'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '@/lib/definitions';
import { loginAction } from '@/actions/auth.actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';

// Note: Ensure you have a toaster component in your layout if you want to use toast()
// For now, I will use inline error states as primary feedback mechanism 
// to match the robust error handling required.

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        setServerError(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('password', data.password);

            // We call the Server Action manually here to handle the response
            // This bridges React Hook Form (Client Validation) with Server Actions (Secure Logic)
            const result = await loginAction(undefined, formData);

            if (result?.message) {
                setServerError(result.message);
                // toast.error(result.message); // Uncomment if 'sonner' or 'react-toastify' is setup
            }
        });
    };

    return (
        <Card className="w-full max-w-sm mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access the dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="jdoe"
                            disabled={isPending}
                            {...register('username')}
                            aria-invalid={!!errors.username}
                        />
                        {errors.username && (
                            <p className="text-sm text-destructive font-medium">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            disabled={isPending}
                            {...register('password')}
                            aria-invalid={!!errors.password}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-xs text-muted-foreground text-center">
                    Protected by secure session management.
                </p>
            </CardFooter>
        </Card>
    );
}
