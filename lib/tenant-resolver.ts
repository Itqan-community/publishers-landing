/**
 * Tenant Resolution Utilities
 * 
 * This module provides functions to resolve tenant identity from various sources:
 * - Subdomain (tenant.domain.com)
 * - Path-based (/tenant/...)
 * - Custom domain (customdomain.com)
 * 
 * The resolver checks all strategies and returns the first match.
 */

import { getTenantIdByHostname } from '@/lib/domains';
import { getDefaultTenantId } from '@/lib/tenant-config';
import { TenantRequest, TenantResolutionStrategy } from '@/types/tenant.types';

/**
 * Subdomain-based tenant resolution
 * Example: publisher1.domain.com -> "publisher1"
 */
export const subdomainStrategy: TenantResolutionStrategy = {
  type: 'subdomain',
  resolve: (request: TenantRequest): string | null => {
    const { hostname } = request;
    
    // Skip localhost and IP addresses
    if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return null;
    }

    const parts = hostname.split('.');
    
    // Need at least 3 parts for subdomain (subdomain.domain.tld)
    if (parts.length < 3) {
      return null;
    }

    const subdomain = parts[0];
    
    // Skip common subdomains
    if (['www', 'api', 'admin'].includes(subdomain)) {
      return null;
    }

    return subdomain;
  },
};

/**
 * Path-based tenant resolution
 * Example: domain.com/publisher1/... -> "publisher1"
 */
export const pathStrategy: TenantResolutionStrategy = {
  type: 'path',
  resolve: (request: TenantRequest): string | null => {
    const { pathname } = request;
    
    // Extract first path segment
    const match = pathname.match(/^\/([^\/]+)/);
    
    if (!match) {
      return null;
    }

    const segment = match[1];
    
    // Skip common paths that aren't tenants
    if (['api', '_next', 'static', 'favicon.ico'].includes(segment)) {
      return null;
    }

    return segment;
  },
};

/**
 * Custom domain tenant resolution
 * Example: customdomain.com -> lookup in domain mapping (from config/tenants.json).
 * Staging: staging--<domain> (e.g. staging--saudi-recitations-center.com) maps to same tenant.
 */
export const domainStrategy: TenantResolutionStrategy = {
  type: 'domain',
  resolve: (request: TenantRequest): string | null => {
    return getTenantIdByHostname(request.hostname);
  },
};

export type TenantResolutionStrategyType = 'domain' | 'subdomain' | 'path';

export interface TenantResolutionResult {
  tenantId: string;
  strategy: TenantResolutionStrategyType;
}

/**
 * Resolve tenant from request and return which strategy matched.
 * Priority order: custom domain → subdomain → path-based.
 */
export function resolveTenantWithStrategy(request: TenantRequest): TenantResolutionResult {
  const strategies = [
    { strategy: 'domain' as const, resolve: domainStrategy.resolve },
    { strategy: 'subdomain' as const, resolve: subdomainStrategy.resolve },
    { strategy: 'path' as const, resolve: pathStrategy.resolve },
  ];

  for (const { strategy, resolve } of strategies) {
    const tenantId = resolve(request);
    if (tenantId) {
      return { tenantId, strategy };
    }
  }

  const fallbackTenantId = getDefaultTenantId();
  return { tenantId: fallbackTenantId, strategy: 'path' };
}

/**
 * Resolve tenant from request using all available strategies
 * Priority order: custom domain → subdomain → path-based
 * Always returns a string (either resolved tenant or default)
 */
export function resolveTenant(request: TenantRequest): string {
  const { tenantId, strategy } = resolveTenantWithStrategy(request);
  if (strategy !== 'path' || tenantId !== getDefaultTenantId()) {
    console.log(`[TenantResolver] Resolved tenant "${tenantId}" using ${strategy} strategy`);
  }
  return tenantId;
}

/**
 * Create a TenantRequest object from various sources
 */
export function createTenantRequest(
  hostname: string,
  pathname: string,
  headers?: Record<string, string>
): TenantRequest {
  return {
    hostname,
    pathname,
    headers: headers || {},
  };
}

/**
 * Get tenant from server-side headers (Next.js)
 * Always returns a string (either resolved tenant or default)
 */
export function getTenantFromHeaders(headers: Headers): string {
  const hostname = headers.get('host') || 'localhost';
  const pathname = headers.get('x-pathname') || '/';
  
  const request = createTenantRequest(hostname, pathname);
  return resolveTenant(request);
}

/**
 * Base path for links: '' on custom domain, '/<tenantId>' on path-based (e.g. localhost/saudi-center).
 * Set by middleware (x-base-path, x-custom-domain). Use for building hrefs so custom domains see clean URLs.
 */
export function getBasePathFromHeaders(headers: Headers): string {
  const isCustomDomain = headers.get('x-custom-domain') === 'true';
  if (isCustomDomain) return '';
  return headers.get('x-base-path') ?? '';
}

/**
 * Get tenant from client-side window
 */
export function getTenantFromWindow(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const request = createTenantRequest(
    window.location.hostname,
    window.location.pathname
  );
  
  return resolveTenant(request);
}

