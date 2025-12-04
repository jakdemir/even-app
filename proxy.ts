import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const start = Date.now();

    // Log incoming request
    console.log('[PROXY] Incoming request', {
        method: request.method,
        url: request.url,
        pathname: request.nextUrl.pathname,
        timestamp: new Date().toISOString(),
    });

    // Continue with the request
    const response = NextResponse.next();

    // Log response time
    const duration = Date.now() - start;
    console.log('[PROXY] Request completed', {
        pathname: request.nextUrl.pathname,
        duration: `${duration}ms`,
    });

    return response;
}

// Configure which routes to run proxy on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
