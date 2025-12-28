import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Multi-Tenant Resolution
 * 
 * This middleware intercepts all requests and adds tenant information
 * to the request headers for use in server components
 */
export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Pass pathname to server components via header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-hostname', hostname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};

