import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { PageLayout } from '@/components/layout/PageLayout';
import { RecitationsPageContent } from '@/components/sections/RecitationsPageContent';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';

const TITLE = 'المصاحف المسجلة';
const DESCRIPTION =
  'استمع إلى القرآن الكريم بأصوات نخبة من أشهر القراء في العالم الإسلامي';

export default async function RecitationsListingPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantId } = await params;
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  const mushafs = await getRecordedMushafs(tenantId);

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-[#f6f4f1]">
        <RecitationsPageContent
          mushafs={mushafs}
          title={TITLE}
          description={DESCRIPTION}
        />
      </div>
    </PageLayout>
  );
}
