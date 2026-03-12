import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantIdsSync } from '@/lib/domains';
import { getDefaultTenantId } from '@/lib/tenant-config';
import {
  createTenantRequest,
  resolveTenantWithStrategy,
} from '@/lib/tenant-resolver';

function buildTenantRewritePath(pathname: string, tenantId: string): string | null {
  if (pathname === '/' || pathname === '') {
    return `/${tenantId}`;
  }
  if (pathname === '/recitations') {
    return `/${tenantId}/recitations`;
  }
  const recitationMatch = pathname.match(/^\/recitations\/([^/]+)(?:\/)?$/);
  if (recitationMatch) {
    return `/${tenantId}/recitations/${recitationMatch[1]}`;
  }
  if (pathname === '/hadiths') {
    return `/${tenantId}/hadiths`;
  }
  const qiraahSlugMatch = pathname.match(/^\/qiraahs\/([^/]+)(?:\/)?$/);
  if (qiraahSlugMatch) {
    return `/${tenantId}/qiraahs/${qiraahSlugMatch[1]}`;
  }
  return null;
}

/**
 * Middleware for Multi-Tenant Resolution (domain + path-based)
 *
 * - Custom domain (e.g. saudi-recitations-center.com): rewrites clean URLs to internal /[tenant]/...
 *   and returns 404 for /[tenantId] paths so tenant IDs are not exposed.
 * - Staging (e.g. staging--<domain>): treated as the same tenant, with clean URLs.
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
  const isLocalhost = hostname === 'localhost';

  // Non-localhost clean URLs for default/path-based tenant (e.g. staging /recitations):
  // rewrite only when the resolver fell back to the default tenant via path strategy,
  // so we never override an explicitly resolved subdomain/custom-domain tenant.
  if (!isLocalhost && !isCustomDomain) {
    const defaultTenant = getDefaultTenantId();
    if (strategy === 'path' && tenantId === defaultTenant) {
      const base = request.nextUrl.origin;
      const search = request.nextUrl.search ?? '';
      const internalPath = buildTenantRewritePath(pathname, defaultTenant);
      if (internalPath) {
        requestHeaders.set('x-custom-domain', 'true');
        requestHeaders.set('x-base-path', '');
        return NextResponse.rewrite(new URL(`${internalPath}${search}`, base), {
          request: { headers: requestHeaders },
        });
      }
    }
  }

  if (isCustomDomain) {
    // On custom domain: 404 if URL path starts with a tenant ID (e.g. /saudi-center or /saudi-center/...)
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    const tenantIds = getTenantIdsSync();
    if (firstSegment && tenantIds.includes(firstSegment)) {
      // Rewrite to a path that triggers app not-found (no tenant __404__)
      return NextResponse.rewrite(new URL('/__404__', request.url));
    }

    // Rewrite clean URLs to internal [tenant] routes (browser URL stays clean); preserve query string
    const base = request.nextUrl.origin;
    const search = request.nextUrl.search ?? '';
    const internalPath = buildTenantRewritePath(pathname, tenantId);
    if (internalPath) {
      requestHeaders.set('x-custom-domain', 'true');
      requestHeaders.set('x-base-path', '');
      return NextResponse.rewrite(new URL(`${internalPath}${search}`, base), {
        request: { headers: requestHeaders },
      });
    }
  }

  // Path-based or subdomain: set base path for link generation (no rewrite)
  // Use tenant path prefix only on localhost; on staging/production use clean URLs (no /tenant in links)
  if (strategy === 'path' && pathname.startsWith(`/${tenantId}`)) {
    if (isLocalhost) {
      requestHeaders.set('x-base-path', `/${tenantId}`);
    } else {
      requestHeaders.set('x-custom-domain', 'true');
      requestHeaders.set('x-base-path', '');
    }
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
