/**
 * Client-safe: listing filter riwayah constant and type.
 * Do not add server-only imports here (e.g. backend-url) — used by client components.
 */

export interface RiwayahOption {
  id: number;
  label: string;
}

/** Forced for now: only show this riwayah in the listing filter (ID 1). */
export const LISTING_RIWAYAH_ID = 1;
