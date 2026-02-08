/**
 * Layout for all [tenant] routes.
 * Provides TenantProvider so tenant and basePath are available to all [tenant]/* pages.
 */

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders, getTenantFromHeaders } from '@/lib/tenant-resolver';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { getThemeStyles } from '@/lib/theme';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { generateOrganizationSchema } from '@/lib/seo';

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

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Google Analytics */}
      {gaId && <GoogleAnalytics gaId={gaId} />}

      <div style={getThemeStyles(tenant.branding)}>
        <TenantProvider initialTenant={tenant} initialBasePath={basePath}>
          <ThemeProvider branding={tenant.branding}>{children}</ThemeProvider>
        </TenantProvider>
      </div>
    </>
  );
}
