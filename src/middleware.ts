import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match only internationalized pathnames
    // Match all pathnames except for:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /static (static files - if any)
    // - /.*\\..* (assets like .css, .png, .ico)
    matcher: ['/((?!api|_next|_vercel|static|.*\\..*).*)']
};
''