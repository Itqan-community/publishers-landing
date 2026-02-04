import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { RecitationsPageContent } from '@/components/sections/RecitationsPageContent';
import { DebugApiVisibility } from '@/components/debug/DebugApiVisibility';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';
import { getRiwayahs } from '@/lib/riwayahs';
import { getDeployEnv } from '@/lib/backend-url';

const TITLE = 'المصاحف المسجلة';
const DESCRIPTION =
  'استمع إلى القرآن الكريم بأصوات نخبة من أشهر القراء في العالم الإسلامي';

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

  const [mushafs, riwayaOptions] = await Promise.all([
    getRecordedMushafs(tenantId, {
      search: search || undefined,
      riwayah_id: riwayahId != null ? [riwayahId] : undefined,
    }, basePath),
    getRiwayahs(tenantId),
  ]);

  const deployEnv = await getDeployEnv();
  const recitationsQuery = new URLSearchParams({ page: '1', page_size: '100' });
  if (search) recitationsQuery.set('search', search);
  if (riwayahIdParam) recitationsQuery.set('riwayah_id', riwayahIdParam);
  const debugApiCalls =
    deployEnv !== 'production'
      ? [
          { path: `recitations/?${recitationsQuery.toString()}`, tenantId },
          { path: 'riwayahs/', tenantId },
        ]
      : [];

  return (
    <PageLayout tenant={tenant}>
      {debugApiCalls.length > 0 && <DebugApiVisibility calls={debugApiCalls} />}
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
