/**
 * @file Login Form Component - Example Implementation
 * @description Ejemplo de implementación del formulario de login usando la nueva arquitectura.
 * 
 * Este componente muestra cómo:
 * - Usar APP_ROUTES en lugar de strings hardcodeados
 * - Manejar errores con ApiError
 * - Integrar con Server Actions
 * - Usar tipos TypeScript correctamente
 */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { APP_ROUTES } from '@/config/app-routes';
import { ApiError } from '@/lib/api-errors';
import type { LoginFormData, IResposeLogin } from '@/lib/definitions';

/**
 * Login Form Component
 * ✅ Usa constantes en lugar de magic strings
 * ✅ Manejo de errores con ApiError
 * ✅ Tipado completo con TypeScript
 */
export const LoginFormExample = () => {
    const [loading, setLoading] = useState(false);
    const [errors] = useState<{ username?: string; password?: string }>({});
    const router = useRouter();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: LoginFormData = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        };
        setLoading(true);

        try {
            // ✅ Llamada al servicio tipada
            const response: IResposeLogin = await authService.login(data);

            // ✅ Validación de respuesta
            if (!response.data?.user) {
                console.error('Error en el inicio de sesión');
                alert('Error en el inicio de sesión');
                return;
            }

            // ✅ Éxito
            console.log(`Bienvenido de vuelta, ${response.data.user.username}`);

            // ✅ Redirección usando constantes (NO magic strings)
            const redirectTo = response.data.user.role !== 'BASIC_USER'
                ? APP_ROUTES.DASHBOARD.ADMIN
                : APP_ROUTES.DASHBOARD.USER;

            router.push(redirectTo);

        } catch (error) {
            // ✅ Manejo de errores tipado
            if (ApiError.isApiError(error)) {
                const message = error.statusCode === 401
                    ? 'Usuario o contraseña incorrectos'
                    : 'Error del servidor. Inténtalo de nuevo.';

                console.error(`Error ${error.statusCode}:`, message);
                alert(`Error: ${message}`);
            } else {
                console.error('Error de conexión:', error);
                alert('Error de conexión. Verifica tu internet.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md p-6">
            <div className="flex flex-col gap-5 justify-center items-center">
                {/* Header */}
                <section className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-center">
                        Iniciar sesión
                    </h1>
                    <p className="text-xs text-gray-600">
                        Por favor, ingrese su usuario y contraseña
                    </p>
                </section>

                {/* Form */}
                <form
                    onSubmit={onSubmit}
                    className="flex flex-col gap-4 w-full"
                >
                    {/* Username Field */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Ingrese su usuario"
                            required
                            minLength={3}
                        />
                        {errors.username && (
                            <p className="text-xs text-red-500">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            required
                            minLength={6}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col gap-3 mt-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>

                        {/* ✅ Usa APP_ROUTES en lugar de "/" */}
                        <Link
                            href={APP_ROUTES.HOME}
                            className="text-sm text-primary underline hover:opacity-80 text-center"
                        >
                            Ir a la página principal
                        </Link>
                    </div>
                </form>

                {/* Register Link */}
                <h3 className="text-sm mt-6 text-center">
                    ¿Todavía no tienes una cuenta? &nbsp;
                    {/* ✅ Usa APP_ROUTES.AUTH.REGISTER en lugar de "/sign-in" */}
                    <Link
                        href={APP_ROUTES.AUTH.REGISTER}
                        className="text-primary underline hover:opacity-80"
                    >
                        Regístrate
                    </Link>
                </h3>
            </div>
        </Card>
    );
};

/**
 * DIFERENCIAS CON EL CÓDIGO ORIGINAL:
 * 
 * ❌ ANTES:
 * - router.push('/admin')  // Magic string
 * - href="/"               // Magic string
 * - href="/sign-in"        // Magic string
 * - const res = await fetchAuth.fetchAuthLogin(data)  // Sin tipado claro
 * 
 * ✅ AHORA:
 * - router.push(APP_ROUTES.DASHBOARD.ADMIN)  // Constante tipada
 * - href={APP_ROUTES.HOME}                    // Constante tipada
 * - href={APP_ROUTES.AUTH.REGISTER}           // Constante tipada
 * - const response: IResposeLogin = await authService.login(data)  // Tipado completo
 * 
 * VENTAJAS:
 * 1. Si cambias las rutas, solo modificas app-routes.ts
 * 2. TypeScript te avisa si la constante no existe
 * 3. Autocompletado en el IDE
 * 4. Más fácil de refactorizar
 * 5. Menos propenso a errores de typos
 */
