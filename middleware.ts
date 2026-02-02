import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantIdsSync } from '@/lib/domains';
import {
  createTenantRequest,
  resolveTenantWithStrategy,
} from '@/lib/tenant-resolver';

/**
 * Middleware for Multi-Tenant Resolution (domain + path-based)
 *
 * - Custom domain (e.g. saudi-recitations-center.com): rewrites /, /recitations, /recitations/[id]
 *   to internal /[tenant]/... and returns 404 for /[tenantId] paths so tenant IDs are not exposed.
 * - Staging: staging--<domain> (e.g. staging--saudi-recitations-center.com) is treated as same tenant.
 * - Path-based (e.g. localhost/saudi-center): no rewrite; x-base-path set for link generation.
 */
export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  const tenantRequest = createTenantRequest(hostname, pathname);
  const { tenantId, strategy } = resolveTenantWithStrategy(tenantRequest);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-hostname', hostname);
  requestHeaders.set('x-tenant-id', tenantId);

  const isCustomDomain = strategy === 'domain';

  if (isCustomDomain) {
    // On custom domain: 404 if URL path starts with a tenant ID (e.g. /saudi-center or /saudi-center/...)
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    const tenantIds = getTenantIdsSync();
    if (firstSegment && tenantIds.includes(firstSegment)) {
      // Rewrite to a path that triggers app not-found (no tenant __404__)
      return NextResponse.rewrite(new URL('/__404__', request.url));
    }

    // Rewrite clean URLs to internal [tenant] routes (browser URL stays clean)
    const base = request.nextUrl.origin;
    if (pathname === '/' || pathname === '') {
      requestHeaders.set('x-custom-domain', 'true');
      requestHeaders.set('x-base-path', '');
      return NextResponse.rewrite(new URL(`/${tenantId}`, base), {
        request: { headers: requestHeaders },
      });
    }
    if (pathname === '/recitations') {
      requestHeaders.set('x-custom-domain', 'true');
      requestHeaders.set('x-base-path', '');
      return NextResponse.rewrite(new URL(`/${tenantId}/recitations`, base), {
        request: { headers: requestHeaders },
      });
    }
    const recitationMatch = pathname.match(/^\/recitations\/([^/]+)(?:\/)?$/);
    if (recitationMatch) {
      requestHeaders.set('x-custom-domain', 'true');
      requestHeaders.set('x-base-path', '');
      return NextResponse.rewrite(
        new URL(`/${tenantId}/recitations/${recitationMatch[1]}`, base),
        { request: { headers: requestHeaders } }
      );
    }
  }

  // Path-based or subdomain: set base path for link generation (no rewrite)
  if (strategy === 'path' && pathname.startsWith(`/${tenantId}`)) {
    requestHeaders.set('x-base-path', `/${tenantId}`);
  } else {
    requestHeaders.set('x-base-path', '');
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|not-found|.*\\..*|api).*)',
  ],
};
