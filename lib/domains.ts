/**
 * Domain → Tenant mapping for custom-domain multi-tenancy.
 * Built from config/tenants.json. Supports staging--<domain> (Netlify-style).
 */

import tenantConfigs from '@/config/tenants.json';
import type { TenantConfig } from '@/types/tenant.types';

const TENANT_IDS = Object.keys(tenantConfigs) as string[];

/** Staging prefix for branch/preview domains (e.g. staging--saudi-recitations-center.com) */
const STAGING_PREFIX = 'staging--';

let domainMapCache: Record<string, string> | null = null;

/**
 * Build domain → tenantId map from tenants that have a "domain" field.
 * Also maps staging--<domain> to the same tenant for staging deployments.
 * Supports multiple domains per tenant via "domains" array.
 */
function buildDomainMap(): Record<string, string> {
  if (domainMapCache) return domainMapCache;

  const map: Record<string, string> = {};

  for (const id of TENANT_IDS) {
    const config = (tenantConfigs as Record<string, TenantConfig>)[id];
    
    // Collect all domains for this tenant (primary + additional)
    const allDomains: string[] = [];
    
    // Add primary domain if exists
    if (config?.domain && typeof config.domain === 'string') {
      allDomains.push(config.domain);
    }
    
    // Add additional domains if exists
    if (config?.domains && Array.isArray(config.domains)) {
      allDomains.push(...config.domains.filter((d): d is string => typeof d === 'string'));
    }

    // Map each domain (production + staging) to tenant ID
    for (const domain of allDomains) {
      // Strip protocol (http://, https://) to get clean hostname
      const cleanDomain = domain.replace(/^https?:\/\//, '');

      // Map both production and staging domains
      map[cleanDomain] = id;
      map[STAGING_PREFIX + cleanDomain] = id;
    }
  }

  domainMapCache = map;
  return map;
}

/**
 * Get tenant ID for a hostname (custom domain or staging--domain).
 * Returns null if hostname is not in the map.
 */
export function getTenantIdByHostname(hostname: string): string | null {
  return buildDomainMap()[hostname] ?? null;
}

/**
 * Domain map for use in tenant-resolver (same source of truth).
 */
export function getDomainMap(): Record<string, string> {
  return buildDomainMap();
}

/**
 * All tenant IDs (sync, for middleware 404 check).
 */
export function getTenantIdsSync(): string[] {
  return TENANT_IDS;
}

/**
 * Clear cache (e.g. in tests or hot reload).
 */
export function clearDomainMapCache(): void {
  domainMapCache = null;
}
