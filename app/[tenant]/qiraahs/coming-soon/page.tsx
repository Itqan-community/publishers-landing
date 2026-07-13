import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { generateTenantMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { isTenQiraahsTemplate } from '@/lib/ten-qiraahs-template';

export const dynamic = 'force-dynamic';

const TITLE = 'قريباً إن شاء الله';
const DESCRIPTION = 'هذه القراءة قيد الإعداد وستكون متاحة قريباً';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId } = await params;
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant || !isTenQiraahsTemplate(tenant.template)) {
    return { title: 'Not Found' };
  }

  return generateTenantMetadata(tenant, {
    title: TITLE,
    description: DESCRIPTION,
    path: `/${tenantId}/qiraahs/coming-soon`,
  });
}

export default async function QiraahComingSoonPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: tenantId } = await params;
  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant || !isTenQiraahsTemplate(tenant.template)) {
    notFound();
  }

  const prefix = basePath || '';

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-[#F9F5F3]">
        <div className="relative bg-[#F9F5F3] -mt-16 lg:-mt-header pt-16 lg:pt-header">
          <div
            className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
            aria-hidden="true"
          />

          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center flex flex-col items-center justify-center gap-8 relative z-10 min-h-[60vh]">
            <div className="w-[100px] h-[100px] rounded-full bg-[#F5EDE4] flex items-center justify-center mx-auto">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 6v6l4 2" stroke="#A67851" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="#A67851" strokeWidth="2"/>
              </svg>
            </div>

            <h1 className="text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-foreground leading-tight">
              {TITLE}
            </h1>

            <p className="text-md sm:text-lg md:text-xl text-text-paragraph max-w-width-lg mx-auto leading-relaxed">
              نحن نعمل بجد لإعداد هذه القراءة وتسجيلاتها بأفضل جودة. ترقبوا إضافتها قريباً بإذن الله.
            </p>

            <div className="mt-4">
              <Button variant="primary" size="lg" asChild>
                <Link href={`${prefix}/#readings`}>
                  العودة للقراءات
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
