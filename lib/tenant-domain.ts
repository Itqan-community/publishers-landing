/**
 * Tenant Domain Resolution for X-Tenant Header Authentication
 * 
 * The backend uses the X-Tenant header to identify which tenant is requesting data.
 * This module provides utilities to resolve the correct tenant domain for API calls.
 */

import 'server-only';
import { headers } from 'next/headers';
import { loadTenantConfig } from './tenant-config';

/**
 * Get the full tenant domain URL for X-Tenant header.
 * This constructs the public-facing domain of the tenant for backend authentication.
 * 
 * Server-side only: Uses Next.js headers to construct the domain.
 * 
 * Priority:
 * 1. Use tenant.domain from config if available
 * 2. Construct from current hostname (x-hostname header)
 * 3. Fallback to localhost:3000 for development
 * 
 * @param tenantId - The tenant identifier
 * @returns Full domain URL (e.g., 'https://saudi-center.example.com' or 'http://localhost:3000')
 * 
 * @example
 * const domain = await getTenantDomain('saudi-center');
 * // Returns: 'https://saudi-center.example.com' or 'http://localhost:3000'
 */
const TAHBEER_X_TENANT = 'https://project-tahbeer.netlify.app';

export async function getTenantDomain(tenantId: string): Promise<string> {
  // Tahbeer: always use canonical domain for X-Tenant header
  if (tenantId === 'tahbeer') {
    return TAHBEER_X_TENANT;
  }

  const tenant = await loadTenantConfig(tenantId);
  
  if (!tenant) {
    throw new Error(`[getTenantDomain] Tenant "${tenantId}" not found`);
  }

  // Priority 1: Use configured domain
  if (tenant.domain) {
    // Ensure it has protocol
    return tenant.domain.startsWith('http') 
      ? tenant.domain 
      : `https://${tenant.domain}`;
  }

  // Priority 2: Construct from current request hostname
  try {
    const headersList = await headers();
    const hostname = headersList.get('x-hostname') || headersList.get('host') || 'localhost:3000';
    
    // Use http for localhost, https for everything else
    const protocol = hostname.includes('localhost') || hostname.includes('127.0.0.1') 
      ? 'http' 
      : 'https';
    
    return `${protocol}://${hostname}`;
  } catch (error) {
    // Fallback if headers are unavailable (shouldn't happen in normal server context)
    console.warn('[getTenantDomain] Could not read headers, using localhost fallback:', error);
    return 'http://localhost:3000';
  }
}

/**
 * Client-side version: Simply returns the domain passed from server.
 * Client components should receive tenantDomain as a prop from their parent server component.
 * 
 * @param tenantDomain - The tenant domain passed from server component
 * @returns The same domain (for consistency with server API)
 * 
 * @example
 * // In client component
 * const domain = getTenantDomainClient(props.tenantDomain);
 */
export function getTenantDomainClient(tenantDomain: string): string {
  return tenantDomain;
}
