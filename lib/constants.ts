/**
 * Centralized constants for the application.
 * Avoid scattering magic numbers throughout the codebase.
 */

/** Default TTL (in seconds) for ISR/revalidation of API data */
export const REVALIDATE_SECONDS = 60;

/** Timeout (ms) for server-side API fetch calls */
export const FETCH_TIMEOUT_MS = 10_000;

/** Default page size for paginated API responses */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum number of recitations per tenant in sitemap */
export const SITEMAP_MAX_RECITATIONS = 1000;

/** Maximum number of featured tracks to show on home page */
export const FEATURED_TRACKS_LIMIT = 5;
