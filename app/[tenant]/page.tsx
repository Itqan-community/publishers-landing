/**
 * Catch-all Tenant Page
 * 
 * This page handles path-based tenant routing
 * Example: /publisher-1 -> loads publisher-1 tenant
 */

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { loadTenantConfig, getAllTenantIds } from '@/lib/tenant-config';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { getTemplate } from '@/templates';
import { getThemeStyles, getFontLink } from '@/lib/theme';
import type { Metadata } from 'next';

/**
 * Generate static params for all tenants (optional, for static export)
 */
export async function generateStaticParams() {
  const tenantIds = await getAllTenantIds();
  return tenantIds.map((tenant) => ({
    tenant,
  }));
}

/**
 * Generate metadata for SEO (runs on server)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId } = await params;
  
  if (!tenantId) {
    return {
      title: 'Welcome',
      description: 'Multi-tenant landing platform',
    };
  }

  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    return {
      title: 'Not Found',
      description: 'Tenant not found',
    };
  }

  return {
    title: `${tenant.name} - Home`,
    description: tenant.content.hero.description,
    openGraph: {
      title: tenant.name,
      description: tenant.content.hero.description,
      images: [tenant.content.hero.image],
    },
    icons: {
      icon: tenant.branding.favicon || '/favicon.ico',
    },
  };
}

/**
 * Tenant Page Component (Server Component)
 */
export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  // Get tenant ID from URL path
  const { tenant: tenantId } = await params;

  console.log('[TenantPage] Path-based tenant ID:', tenantId);

  if (!tenantId) {
    notFound();
  }

  // Load tenant configuration
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    console.error('[TenantPage] Tenant configuration not found:', tenantId);
    notFound();
  }

  // Get the template component for this tenant
  const TemplateComponent = getTemplate(tenant.template);

  return (
    <>
      {/* Inject custom font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={getFontLink(tenant.branding.font)} rel="stylesheet" />

      {/* Apply theme variables inline for SSR */}
      <div style={getThemeStyles(tenant.branding)}>
        <TenantProvider initialTenant={tenant}>
          <ThemeProvider branding={tenant.branding}>
            <TemplateComponent tenant={tenant} />
          </ThemeProvider>
        </TenantProvider>
      </div>
    </>
  );
}

