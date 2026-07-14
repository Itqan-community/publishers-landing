import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { RecitationsPageContent } from '@/components/sections/RecitationsPageContent';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';
import { getRiwayahs } from '@/lib/riwayahs';
import { generateTenantMetadata } from '@/lib/seo';
import { isTenQiraahsTemplate } from '@/lib/ten-qiraahs-template';

/** Always fetch fresh data — no static/cached page so listing count matches API. */
export const dynamic = 'force-dynamic';

const TITLE = 'المصاحف المرتلة';
const DESCRIPTION =
  'استمع إلى القرآن الكريم بأصوات نخبة مختارة من القراء';

/**
 * Generate metadata for recitations listing page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId } = await params;
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant || isTenQiraahsTemplate(tenant.template)) {
    return { title: 'Not Found' };
  }

  return generateTenantMetadata(tenant, {
    title: TITLE,
    description: DESCRIPTION,
    path: `/${tenantId}/recitations`,
  });
}

function parseRiwayahId(value: string | string[] | undefined): number | undefined {
  if (value == null) return undefined;
  const s = Array.isArray(value) ? value[0] : value;
  if (s === '' || s == null) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function parseSearch(value: string | string[] | undefined): string {
  if (value == null) return '';
  const s = Array.isArray(value) ? value[0] : value;
  return typeof s === 'string' ? s : '';
}

export default async function RecitationsListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { tenant: tenantId } = await params;
  const sp = await searchParams;
  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Tahbeer / Qiraat use /qiraahs — not the Saudi Center /recitations listing
  if (isTenQiraahsTemplate(tenant.template)) {
    notFound();
  }

  const search = parseSearch(sp.search);
  const riwayahId = parseRiwayahId(sp.riwayah_id);
  const riwayahIdParam = riwayahId != null ? String(riwayahId) : '';

  const [mushafs, riwayaOptions] = await Promise.all([
    getRecordedMushafs(tenantId, {
      search: search || undefined,
      riwayah_id: riwayahId != null ? [riwayahId] : undefined,
    }, basePath, 'recitations listing page'),
    getRiwayahs(tenantId, 'recitations listing page'),
  ]);

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-[#f6f4f1]">
        <RecitationsPageContent
          tenantId={tenantId}
          template={tenant.template}
          mushafs={mushafs}
          title={TITLE}
          description={DESCRIPTION}
          riwayaOptions={riwayaOptions}
          search={search}
          riwayahId={riwayahIdParam}
        />
      </div>
    </PageLayout>
  );
}
