import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://saudi-recitation-center.netlify.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/static/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
