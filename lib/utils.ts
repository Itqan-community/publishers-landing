import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import tenantConfigs from "@/config/tenants.json";
import { getDefaultTenantId } from "@/lib/tenant-config";
import type { TenantConfig } from "@/types/tenant.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get default headers for API requests
 * Includes Accept-Language: ar for all requests
 */
export function getApiHeaders(additionalHeaders?: Record<string, string>): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ar',
    ...additionalHeaders,
  };
}

/**
 * Get the backend API URL for a tenant based on the current environment.
 *
 * - Uses tenant's `api.development` / `api.staging` / `api.production` from config/tenants.json when set.
 * - Environment: NODE_ENV=development (localhost) → development; NEXT_PUBLIC_ENV=staging → staging; else → production.
 * - If no tenant api config: falls back to NEXT_PUBLIC_API_URL, then default (develop URL for local).
 *
 * @param tenantId - Tenant ID (e.g. "saudi-center"). Uses default tenant if omitted.
 */
export function getBackendUrl(tenantId?: string): string {
  const id = tenantId ?? getDefaultTenantId();
  const config = (tenantConfigs as Record<string, TenantConfig>)[id];

  if (config?.api) {
    const isDev = process.env.NODE_ENV === 'development';
    const isStaging = process.env.NEXT_PUBLIC_ENV === 'staging';
    const env: keyof typeof config.api = isDev ? 'development' : isStaging ? 'staging' : 'production';
    const url = config.api[env] ?? config.api.production;
    return (url ?? '').replace(/\/$/, '');
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  // Default: development URL (localhost)
  return 'https://develop.api.cms.itqan.dev';
}

/**
 * Resolve an image URL from the API.
 * - If url is falsy or empty, returns undefined (use person/placeholder icon).
 * - If url is already absolute (http/https), returns as-is.
 * - If url is relative (e.g. /media/...), prepends baseUrl so Next/Image can load it.
 * Use this for all API-sourced images so we never use mock paths and avoid wrong/cached images.
 */
export function resolveImageUrl(
  url: string | undefined | null,
  baseUrl: string
): string | undefined {
  const trimmed = typeof url === 'string' ? url.trim() : '';
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = baseUrl.replace(/\/$/, '');
  return trimmed.startsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`;
}