import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { RecitationsPageContent } from '@/components/sections/RecitationsPageContent';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';
import { getRiwayahs } from '@/lib/riwayahs';
import { getMockRecordedMushafsForTahbeer, getMockRiwayahsForTahbeer } from '@/lib/mock-tahbeer-recitations';
import { generateTenantMetadata } from '@/lib/seo';

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

  if (!tenant) {
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

  const search = parseSearch(sp.search);
  const riwayahId = parseRiwayahId(sp.riwayah_id);
  const riwayahIdParam = riwayahId != null ? String(riwayahId) : '';

  // Tahbeer: use mock data while BE is down; other tenants use API
  let mushafs: Awaited<ReturnType<typeof getRecordedMushafs>>;
  let riwayaOptions: Awaited<ReturnType<typeof getRiwayahs>>;

  if (tenant.id === 'tahbeer') {
    const mockList = getMockRecordedMushafsForTahbeer(basePath);
    riwayaOptions = getMockRiwayahsForTahbeer();
    // Simple filter by search and riwayah_id so UI works while BE is down
    mushafs = mockList.filter((m) => {
      if (riwayahId != null && !m.badges?.some((b) => b.id === `r${riwayahId}`)) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!m.title.toLowerCase().includes(q) && !m.description.toLowerCase().includes(q) && !m.reciter.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  } else {
    [mushafs, riwayaOptions] = await Promise.all([
      getRecordedMushafs(tenantId, {
        search: search || undefined,
        riwayah_id: riwayahId != null ? [riwayahId] : undefined,
      }, basePath),
      getRiwayahs(tenantId),
    ]);
  }

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-[#f6f4f1]">
        <RecitationsPageContent
          tenantId={tenantId}
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
