import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getQiraahs } from '@/lib/qiraahs';
import { generateTenantMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/**
 * Tahbeer: redirect /riwayahs/[id] to /qiraahs/[slug] for backward compatibility.
 * Non-Tahbeer tenants: 404 (this page was Tahbeer-only).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; id: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId, id } = await params;
  const tenant = await loadTenantConfig(tenantId);
  if (!tenant || tenant.id !== 'tahbeer') {
    return { title: 'Not Found' };
  }
  const qiraahs = await getQiraahs(tenantId, 'riwayahs/[id] redirect page (generateMetadata)');
  const qiraah = qiraahs.find((q) => String(q.id) === id);
  const title = qiraah ? `${qiraah.name} — المصاحف المرتلة` : 'القراءة';
  return generateTenantMetadata(tenant, {
    title,
    description: '',
    path: `/${tenantId}/riwayahs/${id}`,
  });
}

export default async function TahbeerRiwayahRedirectPage({
  params,
}: {
  params: Promise<{ tenant: string; id: string }>;
}) {
  const { tenant: tenantId, id } = await params;
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant || tenant.id !== 'tahbeer') {
    notFound();
  }

  const qiraahs = await getQiraahs(tenantId, 'riwayahs/[id] redirect page');
  const qiraah = qiraahs.find((q) => String(q.id) === id);
  if (!qiraah?.slug) {
    notFound();
  }

  redirect(`/${tenantId}/qiraahs/${qiraah.slug}`);
}
