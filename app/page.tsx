/**
 * Main Landing Page
 * 
 * This page resolves the tenant and renders the appropriate template
 * Server-side rendering ensures SEO optimization
 */

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders, getTenantFromHeaders } from '@/lib/tenant-resolver';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TenantProvider } from '@/components/providers/TenantProvider';
import { getTemplate } from '@/templates';
import { getThemeStyles } from '@/lib/theme';
import type { Metadata } from 'next';

/**
 * Generate metadata for SEO (runs on server)
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const tenantId = getTenantFromHeaders(headersList);

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

  const isSaudiCenter = tenantId === 'saudi-center';
  const pageTitle = isSaudiCenter
    ? 'المركز السعودي للتلاوات القرآنية والأحاديث النبوية'
    : `${tenant.name} - Home`;

  return {
    title: pageTitle,
    description: tenant.content.hero.description,
    openGraph: {
      title: pageTitle,
      description: tenant.content.hero.description,
      images: [tenant.content.hero.image],
    },
    icons: {
      icon: tenant.branding.favicon || '/favicon.ico',
    },
  };
}

/**
 * Main Page Component (Server Component)
 */
export default async function HomePage() {
  // Resolve tenant and base path from request headers
  const headersList = await headers();
  const tenantId = getTenantFromHeaders(headersList);
  const basePath = getBasePathFromHeaders(headersList);

  // console.log('[HomePage] Resolved tenant ID:', tenantId);

  // Load tenant configuration
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    console.error('[HomePage] Tenant configuration not found:', tenantId);
    notFound();
  }

  // Get the template component for this tenant
  const TemplateComponent = getTemplate(tenant.template);

  return (
    <>
      {/* Theme: colors only; font is global IBM Plex Sans Arabic (see app/layout.tsx + globals.css) */}
      <div style={getThemeStyles(tenant.branding)}>
        <TenantProvider initialTenant={tenant} initialBasePath={basePath}>
          <ThemeProvider branding={tenant.branding}>
            <TemplateComponent tenant={tenant} basePath={basePath} />
          </ThemeProvider>
        </TenantProvider>
      </div>
    </>
  );
}

