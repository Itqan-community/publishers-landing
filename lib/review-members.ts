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
 */
export const getReviewMembers = cache(async (
  tenantId: string,
): Promise<ReviewMember[]> => {
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
        console.error(`[getReviewMembers] API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data: PaginatedResponse<ReviewMemberApiResponse> = await response.json();
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
        console.error(`[getReviewMembers] Request timeout for ${apiUrl}`);
        throw new Error(`API request timeout: ${apiUrl}`);
      }
      throw fetchError;
    }
  } catch (error) {
    const backendUrl = await getBackendUrl(tenantId);
    const apiUrl = `${backendUrl}/review-members`;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.warn(`[getReviewMembers] API unavailable (${apiUrl}), returning empty array`);
    } else {
      if (error instanceof Error) {
        console.error(`[getReviewMembers] Error fetching from ${apiUrl}:`, error.message);
      } else {
        console.error(`[getReviewMembers] Unknown error fetching from ${apiUrl}:`, error);
      }
    }

    return [];
  }
});
