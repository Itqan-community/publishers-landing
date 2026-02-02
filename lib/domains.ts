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
 */
function buildDomainMap(): Record<string, string> {
  if (domainMapCache) return domainMapCache;

  const map: Record<string, string> = {};

  for (const id of TENANT_IDS) {
    const config = (tenantConfigs as Record<string, TenantConfig>)[id];
    const domain = config?.domain;
    if (!domain || typeof domain !== 'string') continue;

    map[domain] = id;
    map[STAGING_PREFIX + domain] = id;
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
