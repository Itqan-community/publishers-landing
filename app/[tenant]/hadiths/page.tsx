import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { generateTenantMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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

  const prefix = basePath || '';

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-[#f6f4f1]">
        {/* Top section with background pattern */}
        <div className="relative bg-[#f6f6f4] -mt-16 lg:-mt-header pt-16 lg:pt-header">
          <div
            className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
            aria-hidden="true"
          />

          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center flex flex-col items-center justify-center gap-8 relative z-10">
            <h1 className="text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-foreground leading-tight">
              {TITLE}
            </h1>
            <div className="flex flex-col items-center gap-4">
              <p className="text-md sm:text-lg md:text-xl text-text-paragraph max-w-width-lg mx-auto leading-relaxed">
                نحن نعمل بجد لإعداد تجربة استثنائية لاستعراض الأحاديث النبوية الشريفة. ترقبوا الإطلاق قريباً.
              </p>
            </div>

            <div className="mt-4">
              <Button variant="primary" size="lg" asChild>
                <Link href={prefix || '/'}>
                  العودة للرئيسية
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
