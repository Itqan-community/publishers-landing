import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { TahbeerRiwayahTopSection } from '@/components/sections/TahbeerRiwayahTopSection';
import { TahbeerRiwayahCarouselSection } from '@/components/sections/TahbeerRiwayahCarouselSection';
import { TahbeerSponsorsSection } from '@/components/sections/TahbeerSponsorsSection';
import type { TahbeerSponsorItem } from '@/components/sections/TahbeerSponsorsSection';
import { getMockTahbeerReading } from '@/lib/mock-tahbeer-riwayahs';
import { generateTenantMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/** Sponsor data for riwayah page (same as home) */
const TAHBEER_SPONSORS: TahbeerSponsorItem[] = [
  {
    id: '1',
    name: 'برنامج عبدالرحمن بن عبدالله الموسى لخدمة المجتمع',
    description: 'الداعم الرسمي وشريك النجاح للمشروع',
    logo: '/images/tahbeer/sponsor-mousa-program.svg',
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; id: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId, id } = await params;
  const tenant = await loadTenantConfig(tenantId);
  if (!tenant || tenant.id !== 'tahbeer') {
    return { title: 'Not Found' };
  }
  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const reading = getMockTahbeerReading(id, basePath);
  const title = reading ? `${reading.title} — المصاحف المرتلة` : 'القراءة';
  return generateTenantMetadata(tenant, {
    title,
    description: reading?.description ?? '',
    path: `/${tenantId}/riwayahs/${id}`,
  });
}

export default async function TahbeerRiwayahPage({
  params,
}: {
  params: Promise<{ tenant: string; id: string }>;
}) {
  const { tenant: tenantId, id } = await params;
  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant || tenant.id !== 'tahbeer') {
    notFound();
  }

  const reading = getMockTahbeerReading(id, basePath);
  if (!reading) {
    notFound();
  }

  return (
    <PageLayout tenant={tenant}>
      <div className="relative bg-[#F9F5F3] -mt-16 lg:-mt-header pt-16 lg:pt-header">
        <TahbeerRiwayahTopSection
          title={reading.title}
          description={reading.description}
          imam={{
            name: reading.imam.name,
            label: reading.imam.title,
            bio: reading.imam.bio,
          }}
        />
      </div>

      {reading.riwayahs.map((riwayah, index) => (
        <TahbeerRiwayahCarouselSection
          key={riwayah.id}
          id={index === 0 ? 'listing' : 'featured'}
          riwayahTitle={riwayah.title}
          reciterName={riwayah.reciterName}
          reciterBio={riwayah.reciterBio}
          mushafs={riwayah.mushafs}
        />
      ))}

      <TahbeerSponsorsSection id="sponsors" sponsors={TAHBEER_SPONSORS} />
    </PageLayout>
  );
}
