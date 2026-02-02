import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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