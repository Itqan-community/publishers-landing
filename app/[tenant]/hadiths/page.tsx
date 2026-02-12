import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { generateTenantMetadata } from '@/lib/seo';

/** Always fetch fresh data */
export const dynamic = 'force-dynamic';

const TITLE = 'الأحاديث النبوية الشريفة';
const DESCRIPTION = 'الأحاديث النبوية الشريفة';

/**
 * Generate metadata for hadiths page
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
    path: `/${tenantId}/hadiths`,
  });
}

export default async function HadithsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantId } = await params;
  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="min-h-screen bg-[#f6f4f1] flex items-center justify-center">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            {TITLE}
          </h1>
          <p className="text-3xl md:text-4xl text-gray-600 font-medium">
            قريباً
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
