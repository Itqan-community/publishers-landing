import { MetadataRoute } from 'next';
import { getAllTenantIds, loadTenantConfig } from '@/lib/tenant-config';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';

/**
 * Generate sitemap for all tenants
 * Includes static pages + dynamic recitation pages (max 1000 per tenant)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenantIds = await getAllTenantIds();
  const entries: MetadataRoute.Sitemap = [];

  for (const tenantId of tenantIds) {
    const tenant = await loadTenantConfig(tenantId);
    if (!tenant) continue;

    const baseUrl = tenant.domain
      ? tenant.domain.startsWith('http')
        ? tenant.domain
        : `https://${tenant.domain}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Home page
    entries.push({
      url: `${baseUrl}/${tenantId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });

    // Recitations listing
    entries.push({
      url: `${baseUrl}/${tenantId}/recitations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    // Hadiths listing
    entries.push({
      url: `${baseUrl}/${tenantId}/hadiths`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Dynamic recitation detail pages (with error handling)
    try {
      const recitations = await getRecordedMushafs(tenantId, {
        // Limit to prevent sitemap from getting too large
        // Google allows max 50,000 URLs per sitemap
      }, undefined, 'sitemap');
      
      // Limit to first 1000 recitations per tenant for performance
      const limitedRecitations = recitations.slice(0, 1000);
      
      limitedRecitations.forEach(rec => {
        entries.push({
          url: `${baseUrl}/${tenantId}/recitations/${rec.id}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    } catch (error) {
      // If fetching recitations fails, log error but continue with static pages
      console.error(`[Sitemap] Failed to fetch recitations for tenant ${tenantId}:`, error);
    }

    // Static pages (if they exist)
    const staticPages = ['about', 'contact', 'privacy', 'terms', 'faq'];
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${tenantId}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
