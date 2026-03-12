/**
 * Tenant Configuration Loader
 * 
 * This module handles loading and caching tenant configurations.
 * In production, this would fetch from an API or database.
 * For this demo, it loads from local JSON files.
 */

import { TenantConfig } from '@/types/tenant.types';
import tenantConfigs from '@/config/tenants.json';
import { z } from 'zod';

// In-memory cache for tenant configs
const configCache = new Map<string, TenantConfig>();

/**
 * Default tenant ID used when no tenant can be resolved from the request.
 *
 * This allows temporarily "disabling" multi-tenancy in local/dev by picking one
 * tenant as the default without deleting the multi-tenant plumbing.
 */
export function getDefaultTenantId(): string {
  return process.env.DEFAULT_TENANT_ID || 'saudi-center';
}

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

const TenantConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  domain: z.string().url().optional(),
  domains: z.array(z.string().url()).optional(),
  api: z
    .object({
      development: z.string().url(),
      staging: z.string().url(),
      production: z.string().url(),
    })
    .optional(),
  branding: z.object({
    logo: z.string().min(1),
    logoFull: z.string().optional(),
    favicon: z.string().optional(),
    primaryColor: z.string().min(1),
    secondaryColor: z.string().min(1),
    accentColor: z.string().optional(),
    font: z.string().min(1),
  }),
  features: z.object({
    speakers: z.boolean(),
    statistics: z.boolean(),
    readings: z.boolean(),
    media: z.boolean(),
    newsletter: z.boolean(),
    governmentBanner: z.boolean().optional(),
  }),
  content: z.object({
    hero: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      image: z.string().min(1),
      ctaText: z.string().optional(),
      ctaLink: z.string().optional(),
    }),
    footer: z.object({
      description: z.string().min(1),
      tagline: z.string().optional(),
      contact: z
        .object({
          email: z.string().optional(),
          phone: z.string().optional(),
        })
        .optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            items: z.array(
              z.object({
                text: z.string(),
                href: z.string(),
              })
            ),
          })
        )
        .optional(),
      social: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string(),
            icon: z.string(),
          })
        )
        .optional(),
      copyright: z.string(),
    }),
  }),
  cmsLinks: z.object({
    store: z.string(),
    admin: z.string().optional(),
    support: z.string().optional(),
  }),
  template: z.string(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
      twitterImage: z.string().optional(),
      twitterCard: z.string().optional(),
    })
    .optional(),
  analytics: z
    .object({
      googleAnalyticsId: z.string().optional(),
    })
    .optional(),
});

/**
 * Validate tenant configuration structure
 */
function validateTenantConfig(config: TenantConfig): void {
  TenantConfigSchema.parse(config);
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

