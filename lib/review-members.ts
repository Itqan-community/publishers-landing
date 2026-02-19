import { cache } from 'react';
import { getBackendUrl } from '@/lib/backend-url';
import { getApiHeaders, resolveImageUrl } from '@/lib/utils';
import { getTenantDomain } from '@/lib/tenant-domain';
import type { ReviewMember } from '@/components/sections/ReviewMembersSection';

/**
 * API response model for review-members endpoint.
 * Shape is a best-guess for the mock; adapt once the real API contract is final.
 */
interface ReviewMemberApiResponse {
  id: number;
  name: string;
  /** Committee role, e.g. "رئيس اللجنة" */
  role?: string;
  /** Academic title / specialty, e.g. "أستاذ القراءات بجامعة الاسلامية" */
  title?: string;
  /** Portrait image URL (absolute or relative to backend). */
  image?: string;
  avatar?: string;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
}

/**
 * Server-side data accessor for Review / Arbitration Committee members.
 * Fetches from GET /review-members and maps to the ReviewMember UI model.
 *
 * @param tenantId – Tenant identifier (e.g. "tahbeer")
 * @param callerPage Optional label for console logs (e.g. "TahbeerTemplate (home)")
 */
export const getReviewMembers = cache(async (
  tenantId: string,
  callerPage?: string
): Promise<ReviewMember[]> => {
  const caller = callerPage ? ` (called from: ${callerPage})` : '';
  try {
    const backendUrl = await getBackendUrl(tenantId);
    const tenantDomain = await getTenantDomain(tenantId);
    const apiUrl = `${backendUrl}/review-members`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getApiHeaders(tenantDomain),
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[getReviewMembers]${caller} API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: PaginatedResponse<ReviewMemberApiResponse> = await response.json();
      console.log(JSON.stringify({ api: 'getReviewMembers', url: apiUrl, calledFrom: callerPage ?? null, response: data }, null, 2));
      const backendUrlForImages = await getBackendUrl(tenantId);

      return data.results.map((member): ReviewMember => ({
        id: String(member.id),
        name: member.name,
        role: member.role ?? '',
        title: member.title,
        image: resolveImageUrl(member.image ?? member.avatar, backendUrlForImages),
      }));
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[getReviewMembers]${caller} Request timeout for ${apiUrl}`);
        throw new Error(`API request timeout: ${apiUrl}`);
      }
      throw fetchError;
    }
  } catch (error) {
    const backendUrl = await getBackendUrl(tenantId);
    const apiUrl = `${backendUrl}/review-members`;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.warn(`[getReviewMembers]${caller} API unavailable (${apiUrl}), returning empty array`);
    } else {
      if (error instanceof Error) {
        console.error(`[getReviewMembers]${caller} Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getReviewMembers]${caller} Unknown error fetching from ${apiUrl}:`, error);
      }
    }

    return [];
  }
});
