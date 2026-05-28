// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * High-performance Edge Middleware boundary router.
 * Evaluates credentials prior to page chunk rendering.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Target all routes falling under the administrative path umbrella
  if (pathname.startsWith('/admin')) {
    
    // 2. Read the authentication session cookie tokens
    // Replace 'novamarket_session' with your Auth library token (e.g., NextAuth, Kinde, Clerk)
    const sessionToken = request.cookies.get('novamarket_session')?.value;
    const userRole = request.cookies.get('novamarket_role')?.value;

    // 3. Enforcement Guardrail A: No active session whatsoever
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      // Save the intercepted destination path so we can redirect them back post-login
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 4. Enforcement Guardrail B: Logged in, but lacks administrative clearance
    if (userRole !== 'ADMIN') {
      // Redirect to a clean 403 Access Denied layout route
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Allow the request to pass through cleanly if validation passes
  return NextResponse.next();
}

/**
 * Configure optimized Route Matchers.
 * This prevents our middleware from running on static image assets, scripts, or favicon files.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};