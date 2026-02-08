/**
 * Tenant Home Page
 * Renders the tenant template. Layout provides TenantProvider/ThemeProvider.
 */

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { loadTenantConfig, getAllTenantIds } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { getTemplate } from '@/templates';
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
    title: tenant.name, // Just tenant name, no suffix
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
  const { tenant: tenantId } = await params;

  if (!tenantId) {
    notFound();
  }

  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  const TemplateComponent = getTemplate(tenant.template);

  return (
    <TemplateComponent
      tenant={tenant}
      basePath={basePath}
    />
  );
}

