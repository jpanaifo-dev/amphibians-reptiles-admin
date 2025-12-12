'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '@/lib/definitions';
import { loginAction } from '@/actions/auth.actions';
import { Link, useRouter } from '@/i18n/routing';
import { APP_ROUTES } from '@/config/app-routes';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
    const t = useTranslations('Auth.login');
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('password', data.password);

            const result = await loginAction(undefined, formData);

            if (result?.message === 'Login successful.') {
                const user = result.data?.user;
                const name = user?.person?.firstname || user?.username || 'User';

                toast.success(t('success', { name }), {
                    description: t('successDesc'),
                    duration: 3000,
                });
                router.push(APP_ROUTES.ADMIN.ROOT);
            } else if (result?.message) {
                toast.error(t('errorTitle'), {
                    description: result.message,
                });
            }
        });
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('username')}</FormLabel>
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
                                <FormLabel>{t('password')}</FormLabel>
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

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('submitting')}
                            </>
                        ) : (
                            t('submit')
                        )}
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm text-muted-foreground">
                <Link
                    href={APP_ROUTES.HOME}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    {t('backToHome')}
                </Link>
                <span className="mx-2">|</span>
                <Link
                    href={APP_ROUTES.AUTH.REGISTER}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    {t('register')}
                </Link>
            </div>
        </div>
    );
}
