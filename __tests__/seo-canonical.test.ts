import { describe, it, expect } from 'vitest';

interface Branding {
  favicon?: string;
}

interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  twitterCard?: 'summary' | 'summary_large_image';
  ogImage?: string;
  twitterImage?: string;
}

interface TenantLike {
  id: string;
  name: string;
  domain?: string;
  branding?: Branding;
  seo?: SeoConfig;
}

function generateTenantMetadataLite(
  tenant: TenantLike,
  options?: { title?: string; description?: string; path?: string }
) {
  const seo = tenant.seo || {};
  const baseUrl = tenant.domain || 'https://example.com';
  let path = options?.path || '';
  if (path && !path.startsWith('/')) path = `/${path}`;
  if (tenant.domain && path.startsWith(`/${tenant.id}`)) {
    path = path.slice(tenant.id.length + 1) || '/';
  }
  const url = path ? `${baseUrl}${path}` : baseUrl;
  return {
    alternates: { canonical: url },
  };
}

describe('generateTenantMetadata canonical URLs (lite)', () => {
  const saudiCenter: TenantLike = {
    id: 'saudi-center',
    name: 'Saudi Center',
    domain: 'https://qhc.itqan.dev',
  };

  it('strips tenant prefix from canonical on custom domains', () => {
    const metadata = generateTenantMetadataLite(saudiCenter, {
      path: '/saudi-center/recitations',
    });
    expect(metadata.alternates.canonical).toBe(
      `${saudiCenter.domain}/recitations`
    );
  });
});

