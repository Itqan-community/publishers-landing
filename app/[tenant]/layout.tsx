/**
 * Layout for all [tenant] routes.
 * Provides TenantProvider so tenant and basePath are available to all [tenant]/* pages.
 */

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders, getTenantFromHeaders } from '@/lib/tenant-resolver';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { getThemeStyles, getFontLink } from '@/lib/theme';

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

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={getFontLink(tenant.branding.font)} rel="stylesheet" />
      <div style={getThemeStyles(tenant.branding)}>
        <TenantProvider initialTenant={tenant} initialBasePath={basePath}>
          <ThemeProvider branding={tenant.branding}>{children}</ThemeProvider>
        </TenantProvider>
      </div>
    </>
  );
}
