'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '@/lib/definitions';
import { loginAction } from '@/actions/auth.actions';
import Link from 'next/link';
import { APP_ROUTES } from '@/config/app-routes';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
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

            const result = await loginAction(undefined, formData);

            if (result?.message) {
                setServerError(result.message);
            }
        });
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your credentials to access the admin panel
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="jdoe" disabled={isPending} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            disabled={isPending}
                                            className="pr-10"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isPending}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
            </Form>

            <div className="text-center text-sm text-muted-foreground">
                <Link
                    href={APP_ROUTES.HOME}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Back to Home
                </Link>
                <span className="mx-2">|</span>
                <Link
                    href={APP_ROUTES.AUTH.REGISTER}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}
