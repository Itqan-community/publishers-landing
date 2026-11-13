export interface RecitationFolderRef {
  name: string;
  slug: string;
  is_default: boolean;
}

/** The tracks API query parameter that selects a variant. */
export type RecitationVariantParam = 'quality' | 'folder';

/**
 * The backend renamed folders to qualities: the recitation's `folders` became `qualities`,
 * and the tracks API takes `?quality=` and rejects `?folder=` with a 400.
 * Reads whichever the response has, so the site works with both backend versions.
 * The `folders` fallback can go once production serves `qualities`.
 */
export function recitationVariants(recitation: {
  qualities?: RecitationFolderRef[];
  folders?: RecitationFolderRef[];
}): { folders: RecitationFolderRef[]; variantParam: RecitationVariantParam } {
  if (recitation.qualities) {
    return { folders: recitation.qualities, variantParam: 'quality' };
  }
  return { folders: recitation.folders ?? [], variantParam: 'folder' };
}

export class RecitationFolderNotFoundError extends Error {
  constructor() {
    super('folder_not_found');
    this.name = 'RecitationFolderNotFoundError';
  }
}

export function folderFromQuery(
  folders: RecitationFolderRef[],
  querySlug: string | null
): RecitationFolderRef | undefined {
  if (!folders.length) return undefined;
  const match = querySlug ? folders.find((folder) => folder.slug === querySlug) : undefined;
  return match ?? folders.find((folder) => folder.is_default) ?? folders[0];
}

export function parseFolderQuery(
  value: string | string[] | undefined
): string | null {
  if (value == null) return null;
  const slug = Array.isArray(value) ? value[0] : value;
  if (typeof slug !== 'string' || slug.trim() === '') return null;
  return slug.trim();
}

/** True when the query is absent (default) or matches a known slug. */
export function isKnownFolderQuery(
  folders: RecitationFolderRef[],
  querySlug: string | null
): boolean {
  if (!querySlug) return true;
  if (!folders.length) return true;
  return folders.some((folder) => folder.slug === querySlug);
}
