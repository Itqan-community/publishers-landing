/**
 * Tenant Configuration Loader
 * 
 * This module handles loading and caching tenant configurations.
 * In production, this would fetch from an API or database.
 * For this demo, it loads from local JSON files.
 */

import { TenantConfig } from '@/types/tenant.types';
import tenantConfigs from '@/config/tenants.json';

// In-memory cache for tenant configs
const configCache = new Map<string, TenantConfig>();

/**
 * Load tenant configuration by ID
 * In production, this would be an API call or database query
 */
export async function loadTenantConfig(tenantId: string): Promise<TenantConfig | null> {
  // Check cache first
  if (configCache.has(tenantId)) {
    return configCache.get(tenantId)!;
  }

  try {
    // In production, this would be:
    // const response = await fetch(`/api/tenants/${tenantId}`);
    // const config = await response.json();
    
    // For demo, load from local config
    const config = (tenantConfigs as Record<string, TenantConfig>)[tenantId];
    
    if (!config) {
      console.warn(`[TenantConfig] Tenant "${tenantId}" not found`);
      return null;
    }

    // Validate and cache
    validateTenantConfig(config);
    configCache.set(tenantId, config);
    
    console.log(`[TenantConfig] Loaded config for tenant "${tenantId}"`);
    return config;
  } catch (error) {
    console.error(`[TenantConfig] Error loading tenant "${tenantId}":`, error);
    return null;
  }
}

/**
 * Get all available tenant IDs
 */
export async function getAllTenantIds(): Promise<string[]> {
  return Object.keys(tenantConfigs);
}

/**
 * Validate tenant configuration structure
 */
function validateTenantConfig(config: TenantConfig): void {
  const required = ['id', 'name', 'branding', 'features', 'content', 'cmsLinks', 'template'];
  
  for (const field of required) {
    if (!(field in config)) {
      throw new Error(`Tenant config missing required field: ${field}`);
    }
  }
  
  // Validate branding
  if (!config.branding.primaryColor || !config.branding.secondaryColor) {
    throw new Error('Tenant branding must include primaryColor and secondaryColor');
  }
  
  // Validate content has hero and footer
  if (!config.content.hero || !config.content.footer) {
    throw new Error('Tenant content must include hero and footer');
  }
}

/**
 * Clear config cache (useful for development/testing)
 */
export function clearConfigCache(): void {
  configCache.clear();
}

/**
 * Preload tenant configs (useful for SSG)
 */
export async function preloadTenantConfigs(tenantIds: string[]): Promise<void> {
  await Promise.all(tenantIds.map(id => loadTenantConfig(id)));
}

