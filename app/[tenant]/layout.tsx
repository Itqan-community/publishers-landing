/**
 * Layout for all [tenant] routes.
 * Provides TenantProvider so tenant and basePath are available to all [tenant]/* pages.
 */

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';
import { getDeployEnv } from '@/lib/backend-url';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders, getTenantFromHeaders } from '@/lib/tenant-resolver';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { getThemeStyles } from '@/lib/theme';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { WebVitals } from '@/components/analytics/WebVitals';
import { generateOrganizationSchema } from '@/lib/seo';

/**
 * Generate metadata for tenant layout (favicon, etc.)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const headersList = await headers();
  const resolvedId = getTenantFromHeaders(headersList);
  const tenant = await loadTenantConfig(resolvedId);

  if (!tenant) {
    return {};
  }

  if (tenant.template === 'qiraat') {
    return {
      icons: {
        icon: [
          { url: '/favicons/qiraat.ico', sizes: 'any' },
          { url: '/favicons/qiraat-16x16.png', sizes: '16x16', type: 'image/png' },
          { url: '/favicons/qiraat-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [{ url: '/favicons/qiraat-apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      },
      manifest: '/favicons/qiraat.webmanifest',
    };
  }

  return {
    icons: {
      icon: tenant.branding?.favicon || '/favicon.ico',
    },
  };
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantId } = await params;

  // Middleware rewrites tenant-path-on-custom-domain to /__404__; trigger not-found
  if (tenantId === '__404__') {
    notFound();
  }

  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const resolvedId = getTenantFromHeaders(headersList);
  const tenant = await loadTenantConfig(resolvedId);

  if (!tenant) {
    notFound();
  }

  // Generate structured data
  const organizationSchema = generateOrganizationSchema(tenant);
  const gaId = tenant.analytics?.googleAnalyticsId;
  const isProduction = (await getDeployEnv()) === 'production';

  // Theme styles include --font-primary (Fustat for Tahbeer, Kufam for Qiraat)
  const themeStyles = getThemeStyles(tenant.branding, tenant.template);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Google Analytics */}
      {gaId && <GoogleAnalytics gaId={gaId} isProduction={isProduction} />}

      {/* Web Vitals Performance Tracking */}
      <WebVitals />

      {/* Top Loading Bar for Route Transitions */}
      <NextTopLoader
        color={tenant.branding.primaryColor}
        height={3}
        showSpinner={false}
      />

      <div style={themeStyles} data-template={tenant.template}>
        <TenantProvider initialTenant={tenant} initialBasePath={basePath}>
          <ThemeProvider branding={tenant.branding} template={tenant.template}>
            {children}
          </ThemeProvider>
        </TenantProvider>
      </div>
    </>
  );
}
