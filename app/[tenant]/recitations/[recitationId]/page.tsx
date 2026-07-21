import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { loadTenantConfig } from '@/lib/tenant-config';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { RecitationsPlayer, RecitationItem } from '@/components/audio/AudioPlayer';
import { getRecitationById } from '@/lib/recorded-mushafs';
import { getRecitationTracksByAssetId } from '@/lib/recitation-tracks';
import { getBackendUrl } from '@/lib/backend-url';
import { resolveImageUrl } from '@/lib/utils';
import { AvatarImage } from '@/components/ui/AvatarImage';
import { generateTenantMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { isTenQiraahsTemplate } from '@/lib/ten-qiraahs-template';
import Link from 'next/link';

/**
 * Generate metadata for recitation detail page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string; recitationId: string }>;
}): Promise<Metadata> {
  const { tenant: tenantId, recitationId } = await params;
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    return { title: 'Not Found' };
  }

  const recitation = await getRecitationById(recitationId, tenantId);

  if (!recitation) {
    return { title: 'Not Found' };
  }

  // Build descriptive title: "Recitation Name - Reciter Name"
  const title = `${recitation.name} - ${recitation.reciter.name}`;
  const riwayahPhrase =
    recitation.riwayah === null
      ? 'مصحف الجمع'
      : recitation.riwayah?.name
        ? `برواية ${recitation.riwayah.name}`
        : '';
  const description = riwayahPhrase
    ? `استمع إلى ${recitation.name} ${riwayahPhrase} بصوت ${recitation.reciter.name}`
    : `استمع إلى ${recitation.name} بصوت ${recitation.reciter.name}`;

  return generateTenantMetadata(tenant, {
    title,
    description,
    path: `/${tenantId}/recitations/${recitationId}`,
  });
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

  // Always use SSR - X-Tenant authentication is now in place
  // Listing (/recitations) stays blocked for ten-qiraahs; detail is available for all tenants
  const recitation = await getRecitationById(recitationId, tenantId);

  // If recitation not found, show 404
  if (!recitation) {
    notFound();
  }

  // Log the recitation object to verify the ID
  // Log the recitation object to verify the ID
  /*
  console.log('========================================');
  console.log('[RecitationDetailsPage] Fetched recitation object:');
  console.log('  - recitation.id:', recitation.id);
  console.log('  - recitation.id type:', typeof recitation.id);
  console.log('  - recitation.name:', recitation.name);
  console.log('  - URL recitationId:', recitationId);
  console.log('  - IDs match:', String(recitation.id) === String(recitationId));
  console.log('========================================');
  */

  // Extract reciter information; /recitations/ API often omits reciter image - we get it from tracks
  const reciterName = recitation.reciter?.name || 'غير معروف';
  const backendUrl = await getBackendUrl(tenantId);

  // Fetch tracks first; /recitation-tracks/ returns reciter.image_url, /recitations/ does not
  const tracks = await getRecitationTracksByAssetId(
    recitation.id,
    reciterName,
    undefined, // Let tracks API extract image from response
    tenantId
  );

  // Prefer image from tracks (API includes reciter.image_url); fallback to recitation.reciter
  const reciterImage =
    tracks[0]?.image ||
    (resolveImageUrl(
      recitation.reciter?.image_url ?? recitation.reciter?.image ?? recitation.reciter?.avatar,
      backendUrl
    ) ?? '');

  // Build breadcrumb schema for SEO
  const baseUrl = tenant.domain
    ? (tenant.domain.startsWith('http') ? tenant.domain : `https://${tenant.domain}`)
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Ten-qiraahs tenants have no /recitations listing — middle crumb points home instead
  const homeUrl = `${baseUrl}/${tenantId}`;
  const breadcrumbSchema = generateBreadcrumbSchema(
    isTenQiraahsTemplate(tenant.template)
      ? [
          { name: tenant.name, url: homeUrl },
          { name: recitation.name, url: `${homeUrl}/recitations/${recitationId}` },
        ]
      : [
          { name: tenant.name, url: homeUrl },
          { name: 'المصاحف المرتلة', url: `${homeUrl}/recitations` },
          { name: recitation.name, url: `${homeUrl}/recitations/${recitationId}` },
        ]
  );

  // Update tracks with reciter information (already set, but ensure consistency)
  const tracksWithReciterInfo = tracks.map(track => ({
    ...track,
    reciterName,
    image: reciterImage,
  }));

  // Use actual tracks from API - DO NOT fallback to mock data to avoid confusion
  // If no tracks found, show empty array (the component will handle it)
  const surahItems: RecitationItem[] = tracksWithReciterInfo;

  /*
  console.log('========================================');
  console.log('[RecitationDetailsPage] Final surahItems count:', surahItems.length);
  console.log('[RecitationDetailsPage] Using mock data?', surahItems.length === 0 && process.env.NODE_ENV === 'development' ? 'YES (empty, would use mock)' : 'NO (using API data)');
  console.log('========================================');
  */

  const isQiraat = tenant.template === 'qiraat';

  return (
    <>
      {/* Breadcrumb Structured Data for SEO */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageLayout tenant={tenant}>
        <div dir="rtl" className="bg-white">
          {/* Top section: full width bg + pattern (like hero & listing), content centered, extra block padding */}
          <div
            className={`hero-section-surface relative pb-0 ${
              isQiraat
                ? '-mt-16 pt-16 lg:-mt-header lg:pt-header'
                : 'bg-[#f6f6f4] -mt-7xl pt-7xl lg:-mt-header lg:pt-header'
            }`}
          >
            <div className="hero-bg-pattern" aria-hidden />
            <div className="relative mx-auto max-w-[1280px] px-4 pt-10 pb-10 sm:px-6 sm:pt-12 sm:pb-12 lg:px-8 lg:pt-16 lg:pb-16">
              <section className="overflow-hidden">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-12">
                  {/* Part 1 (RTL start): column 1 = avatar, column 2 = info (row1: title+description, row2: tags). Mobile: centered; desktop: start-aligned. */}
                  <div className="flex flex-col gap-4 items-center lg:flex-row lg:items-start lg:gap-6">
                    <div
                      className={`relative border-[6px] border-white h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] lg:h-[179px] lg:w-[179px] shrink-0 overflow-hidden bg-white ${
                        isQiraat ? 'rounded-[12px]' : 'rounded-xl'
                      }`}
                    >
                      <AvatarImage
                        src={reciterImage}
                        alt={`صورة ${reciterName}`}
                        fill
                        className="object-cover"
                        priority
                        iconSize="h-24 w-24"
                      />
                    </div>
                    <div className="flex min-w-0 w-full flex-1 flex-col items-center gap-2 justify-between h-full lg:w-auto lg:items-start lg:gap-6">
                      <div className="text-center lg:text-start">
                        {isTenQiraahsTemplate(tenant.template) ? (
                          <>
                            <h1 className="text-display-sm font-semibold leading-tight text-[var(--color-foreground)]">
                              {recitation.name || 'مصحف مرتل'}
                            </h1>
                            {isQiraat && (
                              <div
                                className="mx-auto lg:mx-0 mt-3 h-px w-[48px] bg-[var(--color-rule-gold,#A68B4B)] opacity-60"
                                aria-hidden="true"
                              />
                            )}
                            <p className="mt-2 text-lg leading-snug text-[var(--color-text-paragraph,#6a6a6a)]">
                              {reciterName}
                            </p>
                          </>
                        ) : (
                          <>
                            <h1 className="text-display-sm font-semibold leading-tight text-black">
                              {reciterName}
                            </h1>
                            <p className="mt-2 text-lg leading-snug text-[#6a6a6a]">
                              {recitation.name || 'مصحف مرتل'}
                            </p>
                          </>
                        )}
                      </div>
                      {/* Tags: second row; mobile: no gap above, centered; desktop: start side */}
                      <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        {recitation.riwayah === null ? (
                          <span
                            className={
                              isQiraat
                                ? 'rounded-[8px] border border-[var(--color-rule-gold,#A68B4B)]/35 bg-[var(--color-paper,#E6E2D8)] px-[8px] py-[4px] text-xs font-[500] text-[var(--color-foreground)]'
                                : 'rounded-xs bg-white px-[8px] py-[4px] text-xs font-[500] text-[#1f2a37]'
                            }
                          >
                            مصحف الجمع
                          </span>
                        ) : (
                          recitation.riwayah?.name && (
                            <span
                              className={
                                isQiraat
                                  ? 'rounded-[8px] border border-[var(--color-rule-gold,#A68B4B)]/35 bg-[var(--color-paper,#E6E2D8)] px-[8px] py-[4px] text-xs font-[500] text-[var(--color-foreground)]'
                                  : 'rounded-xs bg-white px-[8px] py-[4px] text-xs font-[500] text-[#1f2a37]'
                              }
                            >
                              رواية {recitation.riwayah.name}
                            </span>
                          )
                        )}
                        {recitation.madd_level && (
                          <span
                            className={
                              isQiraat
                                ? 'rounded-[8px] border border-[var(--color-rule-gold,#A68B4B)]/35 bg-[var(--color-paper,#E6E2D8)] px-[8px] py-[4px] text-xs font-[500] text-[var(--color-foreground)]'
                                : 'rounded-xs bg-white px-[8px] py-[4px] text-xs font-[500] text-[#1f2a37]'
                            }
                          >
                            {recitation.madd_level === 'twassut' ? 'بالتوسط' : recitation.madd_level === 'qasr' ? 'بالقصر' : recitation.madd_level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Part 2: CTAs */}
                  <div className="flex w-full flex-1 flex-col justify-between gap-6 mt-auto items-stretch lg:w-auto lg:items-end">
                    <div className="flex w-full flex-wrap items-center justify-center gap-3 lg:w-auto lg:justify-end">
                      <Link href="https://api.cms.itqan.dev/docs/" target="_blank" className="w-full lg:w-auto">
                        <Button
                          variant="secondary"
                          className={
                            isQiraat
                              ? 'w-full gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] lg:w-auto'
                              : 'w-full gap-2 bg-[#0d121c] text-white hover:bg-[#0a0f17] lg:w-auto'
                          }
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" aria-hidden>
                            <g clipPath="url(#api-code-icon-clip)">
                              <path d="M17 8L18.8398 9.85008C19.6133 10.6279 20 11.0168 20 11.5C20 11.9832 19.6133 12.3721 18.8398 13.1499L17 15" stroke={isQiraat ? '#E6E2D8' : '#FAAF41'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M7 8L5.16019 9.85008C4.38673 10.6279 4 11.0168 4 11.5C4 11.9832 4.38673 12.3721 5.16019 13.1499L7 15" stroke={isQiraat ? '#E6E2D8' : '#FAAF41'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M14.5 4L9.5 20" stroke={isQiraat ? '#E6E2D8' : '#FAAF41'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                              <clipPath id="api-code-icon-clip">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          API
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
            <section className="mt-10">
              <RecitationsPlayer
                recitations={surahItems}
                defaultSelected={surahItems[0]?.id}
                variant="details"
                listTitle="قائمة السور"
                hideReciterName={isTenQiraahsTemplate(tenant.template)}
              />
            </section>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
