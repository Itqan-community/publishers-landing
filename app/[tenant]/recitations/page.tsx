import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { getBackendUrl } from '@/lib/backend-url';
import { PageLayout } from '@/components/layout/PageLayout';
import { RecitationsListingClient } from '@/components/sections/RecitationsListingClient';
import type { Metadata } from 'next';

/** Always fetch fresh data — no static/cached page so listing count matches API. */
export const dynamic = 'force-dynamic';

const TITLE = 'المصاحف المرتلة';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId } = await params;
  const tenant = await loadTenantConfig(tenantId);
  if (!tenant) {
    return { title: 'Recitations' };
  }
  const isSaudiCenter = tenantId === 'saudi-center';
  const pageTitle = isSaudiCenter ? TITLE : `${tenant.name} - ${TITLE}`;
  return {
    title: pageTitle,
    description: 'استمع إلى القرآن الكريم بأصوات نخبة مختارة من القراء',
  };
}
const DESCRIPTION =
  'استمع إلى القرآن الكريم بأصوات نخبة مختارة من القراء';

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
  const backendUrl = await getBackendUrl(tenantId);

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-[#f6f4f1]">
        <RecitationsListingClient
          tenantId={tenantId}
          basePath={basePath}
          backendUrl={backendUrl}
          search={search}
          riwayahId={riwayahIdParam}
          title={TITLE}
          description={DESCRIPTION}
        />
      </div>
    </PageLayout>
  );
}
