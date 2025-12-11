import { ApiError } from './api-errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

interface FetchOptions extends RequestInit {
    timeout?: number;
}

class HttpClient {
    private async request<T>(url: string, method: HttpMethod, body?: unknown, options: FetchOptions = {}): Promise<T> {
        const { headers = {}, ...restOptions } = options;

        // 1. Prepare Headers
        const requestHeaders = new Headers(headers);

        // Inject API Key if needed (Example)
        // requestHeaders.set('x-api-key', ENV.PUBLIC_API_KEY);

        // Inject Authorization if token exists (Client-side example)
        // On server actions, you might pass the token explicitly in options.headers
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && !requestHeaders.has('Authorization')) {
                requestHeaders.set('Authorization', `Bearer ${token}`);
            }
        }

        // 2. Smart Content-Type Handling
        if (body) {
            if (body instanceof FormData) {
                // Let the browser set the Content-Type with boundary for FormData
                // Do NOT set 'Content-Type' manually here
            } else {
                // Default to JSON for other body types
                if (!requestHeaders.has('Content-Type')) {
                    requestHeaders.set('Content-Type', 'application/json');
                }
            }
        }

        // 3. Prepare Config
        const config: RequestInit = {
            method,
            headers: requestHeaders,
            body: body instanceof FormData ? body : JSON.stringify(body),
            ...restOptions,
        };

        // GET/HEAD cannot have body
        if (method === 'GET' || method === 'HEAD') {
            delete config.body;
        }

        // 4. Execute Request
        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Try to parse error details from JSON, fall back to text
                let errorDetails: unknown;
                try {
                    errorDetails = await response.json();
                } catch {
                    errorDetails = await response.text();
                }

                throw new ApiError(
                    `Request failed with status ${response.status}`,
                    response.status,
                    errorDetails
                );
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            // Parse Success Response
            return await response.json();

        } catch (error) {
            if (ApiError.isApiError(error)) {
                throw error;
            }
            // Re-throw unknown errors (network issues, etc)
            throw new ApiError(
                error instanceof Error ? error.message : 'Unknown network error',
                500
            );
        }
    }

    get<T>(url: string, options?: FetchOptions) {
        return this.request<T>(url, 'GET', undefined, options);
    }

    post<T>(url: string, body: unknown, options?: FetchOptions) {
        return this.request<T>(url, 'POST', body, options);
    }

    put<T>(url: string, body: unknown, options?: FetchOptions) {
        return this.request<T>(url, 'PUT', body, options);
    }

    patch<T>(url: string, body: unknown, options?: FetchOptions) {
        return this.request<T>(url, 'PATCH', body, options);
    }

    delete<T>(url: string, options?: FetchOptions) {
        return this.request<T>(url, 'DELETE', undefined, options);
    }
}

export const httpClient = new HttpClient();
