export interface RecitationQualityRef {
  name: string;
  slug: string;
  is_default: boolean;
}

/** The recitation's audio variants (`qualities`); the tracks API selects one with `?quality=`. */
export function recitationQualities(recitation: {
  qualities?: RecitationQualityRef[];
}): RecitationQualityRef[] {
  return recitation.qualities ?? [];
}

export class RecitationQualityNotFoundError extends Error {
  constructor() {
    super('quality_not_found');
    this.name = 'RecitationQualityNotFoundError';
  }
}

export function qualityFromQuery(
  qualities: RecitationQualityRef[],
  querySlug: string | null
): RecitationQualityRef | undefined {
  if (!qualities.length) return undefined;
  const match = querySlug ? qualities.find((quality) => quality.slug === querySlug) : undefined;
  return match ?? qualities.find((quality) => quality.is_default) ?? qualities[0];
}

export function parseQualityQuery(
  value: string | string[] | undefined
): string | null {
  if (value == null) return null;
  const slug = Array.isArray(value) ? value[0] : value;
  if (typeof slug !== 'string' || slug.trim() === '') return null;
  return slug.trim();
}

/** True when the query is absent (default) or matches a known slug. */
export function isKnownQualityQuery(
  qualities: RecitationQualityRef[],
  querySlug: string | null
): boolean {
  if (!querySlug) return true;
  if (!qualities.length) return true;
  return qualities.some((quality) => quality.slug === querySlug);
}
