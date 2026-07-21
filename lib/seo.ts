import { Metadata } from 'next';
import { TenantConfig } from '@/types/tenant.types';

/**
 * Canonical site origin for absolute OG/canonical URLs.
 * Prefer the live request host (so scrapers fetch images from the URL being shared),
 * then tenant.domain, then env / localhost.
 */
export function resolveSiteOrigin(
  tenant: TenantConfig,
  requestOrigin?: string | null
): string {
  if (requestOrigin) {
    try {
      const u = new URL(requestOrigin);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        return u.origin;
      }
    } catch {
      /* ignore invalid */
    }
  }
  if (tenant.domain) {
    return tenant.domain.startsWith('http') ? tenant.domain : `https://${tenant.domain}`;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

/** Build origin from Next request headers (x-forwarded-* / host). */
export function originFromHeaders(headersList: Headers): string | null {
  const host =
    headersList.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    headersList.get('host')?.trim();
  if (!host) return null;
  const proto =
    headersList.get('x-forwarded-proto')?.split(',')[0]?.trim() ||
    (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}

/**
 * Generate metadata for a tenant page
 */
export function generateTenantMetadata(
  tenant: TenantConfig,
  options?: {
    title?: string;
    description?: string;
    path?: string;
    /** Override origin (e.g. from request headers) so og:image matches the shared host */
    requestOrigin?: string | null;
  }
): Metadata {
  const seo = tenant.seo || {};
  const baseUrl = resolveSiteOrigin(tenant, options?.requestOrigin);

  const title = options?.title || seo.title || tenant.name;
  const description = options?.description || seo.description || '';
  const path = options?.path ?? '';
  const normalizedPath = path === '/' ? '' : path;
  const url = normalizedPath ? `${baseUrl}${normalizedPath}` : baseUrl;

  // Relative paths + metadataBase → absolute URLs on the host being scraped
  const ogImagePath = seo.ogImage;
  const twitterImagePath = seo.twitterImage || seo.ogImage;

  // Icons (favicon) — Qiraat gets full icon set; others keep single favicon
  const icons: Metadata['icons'] =
    tenant.template === 'qiraat'
      ? {
          icon: [
            { url: '/favicons/qiraat.ico', sizes: 'any' },
            { url: '/favicons/qiraat-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicons/qiraat-32x32.png', sizes: '32x32', type: 'image/png' },
          ],
          apple: [{ url: '/favicons/qiraat-apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
        }
      : {
          icon: tenant.branding?.favicon || '/favicon.ico',
        };

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: seo.keywords,

    openGraph: {
      title,
      description,
      url: url || baseUrl,
      siteName: tenant.name,
      images: ogImagePath
        ? [{ url: ogImagePath, width: 1200, height: 630, alt: title }]
        : [],
      locale: 'ar_SA',
      type: 'website',
    },

    twitter: {
      card: (seo.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
      title,
      description,
      images: twitterImagePath ? [twitterImagePath] : [],
    },

    alternates: {
      canonical: url || baseUrl,
    },

    icons,
    ...(tenant.template === 'qiraat' ? { manifest: '/favicons/qiraat.webmanifest' } : {}),

    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for organization
 */
export function generateOrganizationSchema(
  tenant: TenantConfig,
  requestOrigin?: string | null
) {
  const baseUrl = resolveSiteOrigin(tenant, requestOrigin);

  const logo = tenant.branding?.logo
    ? `${baseUrl}${tenant.branding.logo}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: tenant.name,
    url: baseUrl,
    logo: logo,
    description: tenant.seo?.description || tenant.content?.hero?.description,
    contactPoint: tenant.content?.footer?.contact
      ? {
          '@type': 'ContactPoint',
          email: tenant.content.footer.contact.email,
          telephone: tenant.content.footer.contact.phone,
          contactType: 'Customer Service',
        }
      : undefined,
    sameAs: tenant.content?.footer?.social?.map((s) => s.url) || [],
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
