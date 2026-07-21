import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { loadTenantConfig } from '@/lib/tenant-config';
import { getBasePathFromHeaders } from '@/lib/tenant-resolver';
import { PageLayout } from '@/components/layout/PageLayout';
import { TahbeerRiwayahTopSection } from '@/components/sections/TahbeerRiwayahTopSection';
// import { TahbeerRiwayahsSection } from '@/components/sections/TahbeerRiwayahsSection';
import { TahbeerMushafJamiSection } from '@/components/sections/TahbeerMushafJamiSection';
import { TahbeerRiwayahCarouselSection } from '@/components/sections/TahbeerRiwayahCarouselSection';
import { TahbeerSponsorsSection } from '@/components/sections/TahbeerSponsorsSection';
import type { TahbeerSponsorItem } from '@/components/sections/TahbeerSponsorsSection';
import { getQiraahBySlug } from '@/lib/qiraahs';
import { trimRiwayahName } from '@/lib/tahbeer-riwayah';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';
import { generateTenantMetadata } from '@/lib/seo';
import { isTenQiraahsTemplate } from '@/lib/ten-qiraahs-template';

export const dynamic = 'force-dynamic';

/** Sponsor data for Tahbeer qiraah page (same as home). Qiraat has none. */
const TAHBEER_SPONSORS: TahbeerSponsorItem[] = [
  {
    id: '1',
    name: 'مؤسسة عبدالرحمن بن عبدالله الموسى لخدمة المجتمع',
    description: 'الداعم وشريك النجاح',
    logo: '/images/tahbeer/sponsor-mousa-program.svg',
  },
  {
    id: '2',
    name: 'مؤسسة عبدالله بن إبراهيم السبيعي الخيرية',
    description: 'الداعم وشريك النجاح',
    logo: '/images/tahbeer/sponsor-subaie-charity.svg',
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId, slug } = await params;
  const tenant = await loadTenantConfig(tenantId);
  if (!tenant || !isTenQiraahsTemplate(tenant.template)) {
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

  if (!tenant || !isTenQiraahsTemplate(tenant.template)) {
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

  /** مصحف الجمع: API returns these with `riwayah: null` (see recorded-mushafs mapper → isMushafJami). At most one per qiraah. */
  const combinedMushaf = allRecitations.find((m) => m.isMushafJami === true);

  return (
    <PageLayout tenant={tenant}>
      <div
        className={`hero-section-surface relative -mt-16 lg:-mt-header pt-16 lg:pt-header ${
          tenant.template === 'qiraat' ? '' : 'bg-[#F9F5F3]'
        }`}
      >
        <TahbeerRiwayahTopSection
          title={qiraah.name}
          description=""
          appearance={tenant.template === 'qiraat' ? 'qiraat-archive' : 'default'}
          imam={{
            name: qiraah.name,
            label: 'التعريف بالإمام',
            bio: qiraah.bio ?? '',
          }}
        />
      </div>

      {/* <TahbeerRiwayahsSection id="riwayahs" qiraahName={qiraah.name} riwayahs={riwayahs} /> */}

      {combinedMushaf && (
        <TahbeerMushafJamiSection
          qiraahName={qiraah.name}
          mushaf={combinedMushaf}
          appearance={tenant.template === 'qiraat' ? 'qiraat-archive' : 'default'}
          mushafAppearance={tenant.template === 'qiraat' ? 'qiraat-paper' : 'green'}
        />
      )}

      {riwayahs.map((riwayah, index) => {
        const mushafs = recitationsByRiwayah[index] ?? [];
        const firstMushaf = mushafs[0];
        const reciterName = firstMushaf?.reciter?.name ?? 'قارئ المصحف';
        const reciterBio = riwayah.bio ?? '';
        const isQiraat = tenant.template === 'qiraat';

        return (
          <div key={riwayah.id}>
            {isQiraat && index > 0 && (
              <div className="bg-white" aria-hidden="true">
                <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                  <div className="border-t border-[var(--color-rule-gold,#A68B4B)] opacity-40" />
                </div>
              </div>
            )}
            <TahbeerRiwayahCarouselSection
              id={index === 0 ? 'listing' : `riwayah-${index}`}
              riwayahTitle={`رواية ${trimRiwayahName(riwayah.name)}`}
              reciterName={reciterName}
              reciterBio={reciterBio}
              mushafs={mushafs}
              appearance={isQiraat ? 'qiraat-archive' : 'default'}
              surface="white"
              mushafAppearance={isQiraat ? 'qiraat-paper' : 'default'}
            />
          </div>
        );
      })}

      {tenant.template === 'tahbeer' && (
        <TahbeerSponsorsSection id="sponsors" sponsors={TAHBEER_SPONSORS} />
      )}
    </PageLayout>
  );
}
