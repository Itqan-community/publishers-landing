import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getQiraahs } from '@/lib/qiraahs';
import { generateTenantMetadata } from '@/lib/seo';
import { isTenQiraahsTemplate } from '@/lib/ten-qiraahs-template';

export const dynamic = 'force-dynamic';

/**
 * Ten-qiraahs tenants: redirect /riwayahs/[id] to /qiraahs/[slug] for backward compatibility.
 * Other tenants: 404.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; id: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId, id } = await params;
  const tenant = await loadTenantConfig(tenantId);
  if (!tenant || !isTenQiraahsTemplate(tenant.template)) {
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

  if (!tenant || !isTenQiraahsTemplate(tenant.template)) {
    notFound();
  }

  const qiraahs = await getQiraahs(tenantId, 'riwayahs/[id] redirect page');
  const qiraah = qiraahs.find((q) => String(q.id) === id);
  if (!qiraah?.slug) {
    notFound();
  }

  redirect(`/${tenantId}/qiraahs/${qiraah.slug}`);
}
