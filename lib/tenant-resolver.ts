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
 * Example: customdomain.com -> lookup in domain mapping
 * 
 * Configure your custom domains here for production
 */
export const domainStrategy: TenantResolutionStrategy = {
  type: 'domain',
  resolve: (request: TenantRequest): string | null => {
    const { hostname } = request;
    
    // Custom domain mapping for production
    // Map each custom domain to its tenant ID
    const domainMap: Record<string, string> = {
      // Example mappings - replace with your actual domains:
      // 'tenant1.com': 'publisher-1',
      // 'tenant2.com': 'publisher-2',
      // 'academicpress.org': 'publisher-1',
      // 'globalmagazine.com': 'publisher-2',
    };
    
    return domainMap[hostname] || null;
  },
};

/**
 * Resolve tenant from request using all available strategies
 * Priority order: custom domain → subdomain → path-based
 */
export function resolveTenant(request: TenantRequest): string | null {
  // Check strategies in priority order
  // 1. Custom domain (highest priority for production)
  // 2. Subdomain (e.g., publisher-1.yourdomain.com)
  // 3. Path-based (e.g., localhost/publisher-1 - mainly for local development)
  const strategies = [domainStrategy, subdomainStrategy, pathStrategy];
  
  for (const strategy of strategies) {
    const tenantId = strategy.resolve(request);
    if (tenantId) {
      console.log(`[TenantResolver] Resolved tenant "${tenantId}" using ${strategy.type} strategy`);
      return tenantId;
    }
  }
  
  console.log('[TenantResolver] No tenant resolved, using default');
  return 'default';
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
 */
export function getTenantFromHeaders(headers: Headers): string | null {
  const hostname = headers.get('host') || 'localhost';
  const pathname = headers.get('x-pathname') || '/';
  
  const request = createTenantRequest(hostname, pathname);
  return resolveTenant(request);
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

