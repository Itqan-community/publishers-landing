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
import { getQiraahBySlug } from '@/lib/qiraahs';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';
import { generateTenantMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

/** Sponsor data for qiraah page (same as home) */
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
  params: Promise<{ tenant: string; slug: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId, slug } = await params;
  const tenant = await loadTenantConfig(tenantId);
  if (!tenant || tenant.id !== 'tahbeer') {
    return { title: 'Not Found' };
  }
  const qiraah = await getQiraahBySlug(tenantId, slug, 'qiraahs/[slug]');
  const title = qiraah ? `${qiraah.name} — المصاحف المرتلة` : 'القراءة';
  return generateTenantMetadata(tenant, {
    title,
    description: '',
    path: `/${tenantId}/qiraahs/${slug}`,
  });
}

export default async function TahbeerQiraahPage({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>;
}) {
  const { tenant: tenantId, slug } = await params;
  const headersList = await headers();
  const basePath = getBasePathFromHeaders(headersList);
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant || tenant.id !== 'tahbeer') {
    notFound();
  }

  const qiraah = await getQiraahBySlug(tenantId, slug, 'qiraahs/[slug]');
  if (!qiraah) {
    notFound();
  }

  const riwayahs = qiraah.riwayahs ?? [];
  const allRecitations = await getRecordedMushafs(
    tenantId,
    { qiraah_id: qiraah.id, page_size: 100 },
    basePath,
    'qiraahs/[slug] page'
  );

  const recitationsByRiwayah = riwayahs.map((riwayah) =>
    allRecitations.filter((m) => m.riwayahId === String(riwayah.id))
  );

  return (
    <PageLayout tenant={tenant}>
      <div className="relative bg-[#F9F5F3] -mt-16 lg:-mt-header pt-16 lg:pt-header">
        <TahbeerRiwayahTopSection
          title={qiraah.name}
          description=""
          imam={{
            name: qiraah.name,
            label: 'التعريف بالإمام',
            bio: qiraah.bio ?? '',
          }}
        />
      </div>

      {riwayahs.map((riwayah, index) => {
        const mushafs = recitationsByRiwayah[index] ?? [];
        const firstMushaf = mushafs[0];
        const reciterName = firstMushaf?.reciter?.name ?? 'قارئ المصحف';
        const reciterBio = firstMushaf?.description ?? '';

        return (
          <TahbeerRiwayahCarouselSection
            key={riwayah.id}
            id={index === 0 ? 'listing' : 'featured'}
            riwayahTitle={riwayah.name}
            reciterName={reciterName}
            reciterBio={reciterBio}
            mushafs={mushafs}
          />
        );
      })}

      <TahbeerSponsorsSection id="sponsors" sponsors={TAHBEER_SPONSORS} />
    </PageLayout>
  );
}
