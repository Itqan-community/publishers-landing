import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get default headers for API requests.
 * Includes X-Tenant header for backend authentication.
 * 
 * The backend uses X-Tenant header to identify which tenant is requesting data.
 * This is more reliable than Origin-based authentication and works with SSR.
 * 
 * @param tenantDomain - Full tenant domain for X-Tenant header (e.g., 'https://saudi-center.example.com' or 'http://localhost:3000')
 * @param additionalHeaders - Any additional headers to include
 * @returns Headers object with X-Tenant and standard API headers
 * 
 * @example
 * // Server-side
 * const tenantDomain = await getTenantDomain('saudi-center');
 * const headers = getApiHeaders(tenantDomain);
 * 
 * // Client-side
 * const headers = getApiHeaders(props.tenantDomain);
 */
export function getApiHeaders(
  tenantDomain?: string,
  additionalHeaders?: Record<string, string>
): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ar',
  };

  // Add X-Tenant header for backend authentication
  if (tenantDomain) {
    headers['X-Tenant'] = tenantDomain;
  }

  return {
    ...headers,
    ...additionalHeaders,
  };
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