import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBackendUrl } from '@/lib/backend-url';
import { RecitationDetailClient } from '@/components/recitation/RecitationDetailClient';
import type { Metadata } from 'next';

interface RecitationApiResult {
  id: number;
  name?: string;
  [key: string]: unknown;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; recitationId: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId, recitationId } = await params;
  const tenant = await loadTenantConfig(tenantId);
  if (!tenant) return { title: 'Recitation' };

  const backendUrl = await getBackendUrl(tenantId);
  const url = `${backendUrl}/recitations/?id=${encodeURIComponent(recitationId)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'Accept-Language': 'ar' },
      next: { revalidate: 60 },
    });
    if (!res.ok) return { title: tenant.name };

    const data = await res.json();
    let rec: RecitationApiResult | null = null;
    if (Array.isArray(data.results) && data.results.length > 0) {
      rec = data.results.find(
        (r: RecitationApiResult) => String(r.id) === String(recitationId)
      ) ?? data.results[0];
    } else if (data.id != null) {
      rec = data as RecitationApiResult;
    }
    const title = rec?.name?.trim() || 'مصحف مرتل';
    return {
      title: tenantId === 'saudi-center' ? title : `${title} - ${tenant.name}`,
    };
  } catch {
    return { title: tenant.name };
  }
}

export default async function RecitationDetailsPage({
  params,
}: {
  params: Promise<{ tenant: string; recitationId: string }>;
}) {
  const { tenant: tenantId, recitationId } = await params;
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  const backendUrl = await getBackendUrl(tenantId);

  return (
    <RecitationDetailClient
      tenant={tenant}
      tenantId={tenantId}
      backendUrl={backendUrl}
      recitationId={recitationId}
    />
  );
}
