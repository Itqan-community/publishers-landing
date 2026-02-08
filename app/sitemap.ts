import { MetadataRoute } from 'next';
import { getAllTenantIds, loadTenantConfig } from '@/lib/tenant-config';

/**
 * Generate sitemap for all tenants
 * This creates a per-tenant sitemap index
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

    // TODO: Add dynamic recitation detail pages
    // This would require fetching from API, which might be slow
    // Consider creating a separate sitemap route for recitations
  }

  return entries;
}
