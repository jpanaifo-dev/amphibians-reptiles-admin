# 🏗️ Arquitectura de Networking - Documentación Técnica

## 📋 Índice
- [Introducción](#introducción)
- [Estructura de Archivos](#estructura-de-archivos)
- [Componentes Principales](#componentes-principales)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

Esta arquitectura implementa una capa de networking profesional y escalable para Next.js 14+ (App Router), siguiendo los principios **SOLID**, **Clean Code** y **DRY**.

### ✨ Características Principales

- ✅ **Cero Magic Strings**: Todas las URLs y rutas están centralizadas en constantes
- ✅ **Tipado Genérico**: Soporte completo de TypeScript con tipos `<T>`
- ✅ **Isomórfico**: Compatible con Server Components, Server Actions y Client Components
- ✅ **Content-Type Inteligente**: Detecta automáticamente JSON vs FormData
- ✅ **Manejo de Errores Robusto**: Clase `ApiError` personalizada
- ✅ **Validación de ENV**: Variables de entorno validadas con Zod

---

## 📁 Estructura de Archivos

```
src/
├── config/
│   ├── env.ts              # ✅ Validación de variables de entorno con Zod
│   ├── api-routes.ts       # ✅ Constantes de endpoints de la API
│   └── app-routes.ts       # ✅ Rutas internas de la aplicación
│
├── lib/
│   ├── api-client.ts       # ✅ Cliente HTTP (wrapper de fetch)
│   ├── api-errors.ts       # ✅ Clase ApiError personalizada
│   └── definitions.ts      # ✅ Tipos TypeScript compartidos
│
├── services/
│   ├── auth.service.ts     # ✅ Servicio de autenticación
│   └── user.service.ts     # ✅ Servicio de usuarios
│
└── actions/
    └── auth.actions.ts     # ✅ Server Actions para autenticación
```

---

## 🔧 Componentes Principales

### 1️⃣ **Validación de Variables de Entorno** (`config/env.ts`)

**Problema que resuelve**: Evita errores en runtime por variables faltantes o mal configuradas.

```typescript
import { ENV } from '@/config/env';

// ✅ Tipado y validado automáticamente
const apiUrl = ENV.API_BASE_URL;  // string (garantizado)
const env = ENV.NODE_ENV;         // 'development' | 'production' | 'test'
```

**Cómo funciona**:
- Usa **Zod** para validar el tipo y formato de cada variable
- Si falta una variable requerida, la app **no arranca** (fail-fast)
- Calcula automáticamente `API_BASE_URL` según el entorno

---

### 2️⃣ **Constantes de API Endpoints** (`config/api-routes.ts`)

**Problema que resuelve**: Elimina URLs hardcodeadas y typos en toda la aplicación.

```typescript
import { API_ROUTES } from '@/config/api-routes';

// ❌ MAL (Magic String)
const response = await fetch('http://localhost:8000/auth/login', {...});

// ✅ BIEN (Constante)
const response = await httpClient.post(API_ROUTES.AUTH.LOGIN, credentials);

// ✅ Rutas dinámicas
const userUrl = API_ROUTES.USERS.GET_BY_ID(123);
// Resultado: "http://localhost:8000/users/123"
```

**Ventajas**:
- Si cambias la URL base, solo modificas `ENV.API_BASE_URL`
- Autocompletado de TypeScript
- Fácil de testear (mock de rutas)

---

### 3️⃣ **Constantes de Rutas Internas** (`config/app-routes.ts`)

**Problema que resuelve**: Evita escribir `/dashboard/users` manualmente en `<Link>` o `redirect()`.

```typescript
import { APP_ROUTES } from '@/config/app-routes';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// ✅ En componentes
<Link href={APP_ROUTES.AUTH.LOGIN}>Iniciar Sesión</Link>

// ✅ En Server Actions
redirect(APP_ROUTES.DASHBOARD.ADMIN);

// ✅ Rutas dinámicas
const userProfileUrl = APP_ROUTES.DASHBOARD.USER_DETAILS(userId);
```

---

### 4️⃣ **Cliente HTTP** (`lib/api-client.ts`)

**Problema que resuelve**: Wrapper inteligente de `fetch` con soporte isomórfico.

#### 🎯 Características Clave:

1. **Tipado Genérico**:
   ```typescript
   // ✅ TypeScript sabe que 'user' es de tipo User
   const user = await httpClient.get<User>(API_ROUTES.USERS.GET_BY_ID(1));
   console.log(user.username); // Autocompletado ✨
   ```

2. **Content-Type Inteligente**:
   ```typescript
   // JSON automático
   await httpClient.post(url, { name: 'John' });
   // Header: Content-Type: application/json

   // FormData automático (sin header manual)
   const formData = new FormData();
   formData.append('file', file);
   await httpClient.post(url, formData);
   // ✅ Browser maneja el boundary correctamente
   ```

3. **Autenticación Automática**:
   ```typescript
   // Cliente: Lee de document.cookie
   // Servidor: Lee de cookies() de Next.js
   // ✅ Sin código adicional en cada request
   ```

4. **Manejo de Errores**:
   ```typescript
   try {
     await httpClient.post(API_ROUTES.AUTH.LOGIN, credentials);
   } catch (error) {
     if (ApiError.isApiError(error)) {
       console.error(`Error ${error.statusCode}: ${error.message}`);
       console.error('Detalles:', error.details);
     }
   }
   ```

---

### 5️⃣ **Clase ApiError** (`lib/api-errors.ts`)

**Problema que resuelve**: Distingue errores de API de errores de red.

```typescript
export class ApiError extends Error {
    public statusCode: number;
    public details?: unknown;

    static isApiError(error: unknown): error is ApiError {
        return error instanceof ApiError;
    }
}
```

**Uso**:
```typescript
catch (error) {
    if (ApiError.isApiError(error)) {
        // Error de API (400, 401, 500, etc.)
        toast.error(`Error ${error.statusCode}`);
    } else {
        // Error de red (fetch falló)
        toast.error('Sin conexión');
    }
}
```

---

## 📚 Ejemplos de Uso

### 🔐 Ejemplo 1: Login desde Client Component

**Componente (`FrmLogin.tsx`)**:
```tsx
'use client';
import { useFormState } from 'react-dom';
import { loginAction } from '@/actions/auth.actions';
import { APP_ROUTES } from '@/config/app-routes';

export function LoginForm() {
    const [state, formAction] = useFormState(loginAction, undefined);

    return (
        <form action={formAction}>
            <input name="username" placeholder="Usuario" />
            <input name="password" type="password" placeholder="Contraseña" />
            
            {state?.errors?.username && <p>{state.errors.username[0]}</p>}
            {state?.errors?._form && <p>{state.errors._form[0]}</p>}
            
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
}
```

**Server Action (`actions/auth.actions.ts`)**:
```tsx
'use server';
import { authService } from '@/services/auth.service';
import { APP_ROUTES } from '@/config/app-routes';
import { redirect } from 'next/navigation';

export async function loginAction(prevState, formData: FormData) {
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password'),
    };

    try {
        const response = await authService.login(credentials);

        if (response.data?.user) {
            // ✅ Guarda token en cookies HTTP-only
            await createSession(response.data);
            
            // ✅ Redirección según rol
            redirect(response.data.user.role === 'ADMIN' 
                ? APP_ROUTES.DASHBOARD.ADMIN 
                : APP_ROUTES.DASHBOARD.USER
            );
        }
    } catch (error) {
        return { errors: { _form: ['Credenciales inválidas'] } };
    }
}
```

---

### 👥 Ejemplo 2: Obtener Lista de Usuarios

**Server Component**:
```tsx
import { userService } from '@/services/user.service';

export default async function UsersPage() {
    // ✅ Llamada directa desde Server Component
    const response = await userService.getAll({ 
        page: 1, 
        pageSize: 10 
    });

    return (
        <div>
            {response.data.data.map(user => (
                <div key={user.id}>{user.username}</div>
            ))}
        </div>
    );
}
```

**Client Component (con useEffect)**:
```tsx
'use client';
import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';

export function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        userService.getAll().then(res => setUsers(res.data.data));
    }, []);

    return <div>{users.map(u => <p key={u.id}>{u.username}</p>)}</div>;
}
```

---

### 📤 Ejemplo 3: Subir Avatar (FormData)

```tsx
'use client';
import { userService } from '@/services/user.service';

async function handleUpload(file: File, userId: number) {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        // ✅ httpClient detecta FormData automáticamente
        const updatedUser = await userService.uploadAvatar(userId, formData);
        console.log('Avatar actualizado:', updatedUser.data.avatar);
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

## ⚡ Mejores Prácticas

### ✅ DO (Hacer)

1. **Siempre usa constantes**:
   ```typescript
   // ✅ BIEN
   redirect(APP_ROUTES.AUTH.LOGIN);
   
   // ❌ MAL
   redirect('/login');
   ```

2. **Tipado genérico en todas las llamadas**:
   ```typescript
   // ✅ BIEN
   const user = await httpClient.get<User>(url);
   
   // ❌ MAL (any implícito)
   const user = await httpClient.get(url);
   ```

3. **Maneja errores con ApiError**:
   ```typescript
   catch (error) {
       if (ApiError.isApiError(error)) {
           // Manejo específico
       }
   }
   ```

4. **Usa Server Actions para mutaciones**:
   ```typescript
   // ✅ BIEN (desde Client Component)
   <form action={loginAction}>
   
   // ❌ MAL (expone credenciales en cliente)
   const handleSubmit = async () => {
       await fetch('/api/login', { ... });
   };
   ```

### ❌ DON'T (No hacer)

1. **No hardcodees URLs**:
   ```typescript
   // ❌ MAL
   fetch('http://localhost:8000/users')
   
   // ✅ BIEN
   httpClient.get(API_ROUTES.USERS.GET_ALL)
   ```

2. **No uses `fetch` directamente** (usa `httpClient`):
   ```typescript
   // ❌ MAL
   const res = await fetch(url, { headers: {...}, body: ... });
   
   // ✅ BIEN
   const res = await httpClient.post<User>(url, body);
   ```

3. **No mezcles localStorage con Server Components**:
   ```typescript
   // ❌ MAL (Server Component)
   const token = localStorage.getItem('token'); // Error!
   
   // ✅ BIEN (usa cookies)
   import { cookies } from 'next/headers';
   const token = cookies().get('token')?.value;
   ```

---

## 🚀 Siguientes Pasos

1. **Añade más servicios** (ej. `post.service.ts`, `comment.service.ts`)
2. **Implementa refresh token automático** en `httpClient`
3. **Añade interceptores** para logging/analytics
4. **Implementa retry logic** para requests fallidos

---

## 📝 Resumen Técnico

| Concepto | Ubicación | Propósito |
|----------|-----------|-----------|
| **ENV** | `config/env.ts` | Validación de variables de entorno |
| **API_ROUTES** | `config/api-routes.ts` | Constantes de endpoints de API |
| **APP_ROUTES** | `config/app-routes.ts` | Rutas internas de navegación |
| **httpClient** | `lib/api-client.ts` | Cliente HTTP con tipado genérico |
| **ApiError** | `lib/api-errors.ts` | Manejo de errores tipado |
| **authService** | `services/auth.service.ts` | Servicio de autenticación |
| **loginAction** | `actions/auth.actions.ts` | Server Action para login |

---

**🎓 Arquitectura diseñada con principios Senior**: Clean Code, SOLID, DRY, Type Safety, Isomorphic Compatibility.
