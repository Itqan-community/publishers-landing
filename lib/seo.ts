import { Metadata } from 'next';
import { TenantConfig } from '@/types/tenant.types';

/**
 * Generate metadata for a tenant page
 */
export function generateTenantMetadata(
  tenant: TenantConfig,
  options?: {
    title?: string;
    description?: string;
    path?: string;
  }
): Metadata {
  const seo = tenant.seo || {};
  const baseUrl = tenant.domain 
    ? (tenant.domain.startsWith('http') ? tenant.domain : `https://${tenant.domain}`)
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const title = options?.title || seo.title || tenant.name;
  const description = options?.description || seo.description || '';
  const url = options?.path ? `${baseUrl}${options.path}` : baseUrl;

  // Build absolute image URLs
  const ogImage = seo.ogImage ? `${baseUrl}${seo.ogImage}` : undefined;
  const twitterImage = seo.twitterImage ? `${baseUrl}${seo.twitterImage}` : ogImage;

  return {
    title,
    description,
    keywords: seo.keywords,
    
    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: tenant.name,
      images: ogImage ? [{ url: ogImage, width: 1280, height: 720, alt: title }] : [],
      locale: 'ar_SA',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: (seo.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
      title,
      description,
      images: twitterImage ? [twitterImage] : [],
    },

    // Alternate languages (if needed in future)
    alternates: {
      canonical: url,
    },

    // Icons (favicon)
    icons: {
      icon: tenant.branding?.favicon || '/favicon.ico',
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
    },

    // Verification tags (add later if needed)
    // verification: {
    //   google: 'your-google-verification-code',
    // },
  };
}

/**
 * Generate structured data (JSON-LD) for organization
 */
export function generateOrganizationSchema(tenant: TenantConfig) {
  const baseUrl = tenant.domain 
    ? (tenant.domain.startsWith('http') ? tenant.domain : `https://${tenant.domain}`)
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
    contactPoint: tenant.content?.footer?.contact ? {
      '@type': 'ContactPoint',
      email: tenant.content.footer.contact.email,
      telephone: tenant.content.footer.contact.phone,
      contactType: 'Customer Service',
    } : undefined,
    sameAs: tenant.content?.footer?.social?.map(s => s.url) || [],
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
