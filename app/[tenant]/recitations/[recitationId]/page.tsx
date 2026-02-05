import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBackendUrl } from '@/lib/backend-url';
import { RecitationDetailClient } from '@/components/recitation/RecitationDetailClient';

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
