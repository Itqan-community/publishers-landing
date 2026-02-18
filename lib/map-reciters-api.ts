/**
 * Pure mapping from backend reciters API to UI types.
 * Safe to import from client (no server-only deps).
 */

import { resolveImageUrl } from '@/lib/utils';
import type { ReciterCardProps } from '@/components/cards/ReciterCard';

export interface ReciterApiResponse {
  id: number;
  name: string;
  recitations_count: number;
  image_url?: string;
  image?: string;
  avatar?: string;
}

export function mapRecitersApiToReciterCardProps(
  results: ReciterApiResponse[],
  backendUrl: string,
  pathPrefix: string
): ReciterCardProps[] {
  const list = Array.isArray(results) ? results : [];
  return list.map((reciter): ReciterCardProps => {
    const image =
      resolveImageUrl(reciter.image_url ?? reciter.image ?? reciter.avatar, backendUrl) ?? '';
    return {
      id: String(reciter.id),
      name: reciter.name,
      title: 'قارئ وإمام',
      image,
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `${pathPrefix}/reciters/${reciter.id}`,
    };
  });
}
