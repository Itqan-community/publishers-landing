import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { RecitationsPlayer, RecitationItem } from '@/components/audio/AudioPlayer';
import { FiMessageCircle, FiHeart, FiShare2 } from 'react-icons/fi';
import { getRecitationById } from '@/lib/recorded-mushafs';
import { getRecitationTracksByAssetId } from '@/lib/recitation-tracks';
import { getBackendUrl } from '@/lib/backend-url';
import { resolveImageUrl } from '@/lib/utils';
import { AvatarImage } from '@/components/ui/AvatarImage';
import Link from 'next/link';

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

  // Log the recitationId from URL params
  console.log('========================================');
  console.log('[RecitationDetailsPage] URL params recitationId:', recitationId);
  console.log('[RecitationDetailsPage] recitationId type:', typeof recitationId);
  console.log('========================================');

  // First, fetch recitation details to get the asset ID
  const recitation = await getRecitationById(recitationId, tenantId);

  // If recitation not found, show 404
  if (!recitation) {
    notFound();
  }

  // Log the recitation object to verify the ID
  console.log('========================================');
  console.log('[RecitationDetailsPage] Fetched recitation object:');
  console.log('  - recitation.id:', recitation.id);
  console.log('  - recitation.id type:', typeof recitation.id);
  console.log('  - recitation.name:', recitation.name);
  console.log('  - URL recitationId:', recitationId);
  console.log('  - IDs match:', String(recitation.id) === String(recitationId));
  console.log('========================================');

  // Extract reciter information; use image from API only (no mock paths)
  const reciterName = recitation.reciter?.name || 'غير معروف';
  const reciterImage =
    resolveImageUrl(
      recitation.reciter?.image ?? recitation.reciter?.avatar,
      await getBackendUrl(tenantId)
    ) ?? '';

  // IMPORTANT: Use recitation.id (from API response) as asset_id for tracks API
  // The API endpoint /recitation-tracks/{asset_id}/ expects the recitation's ID
  // However, if there's a mismatch, fall back to the URL param (converted to number if possible)
  let assetIdForTracks: string | number = recitation.id;
  
  // Verify the ID matches - if not, log a warning but still use recitation.id
  if (String(recitation.id) !== String(recitationId)) {
    console.warn('[RecitationDetailsPage] WARNING: recitation.id does not match URL recitationId!', {
      recitationId: recitation.id,
      urlRecitationId: recitationId,
    });
    // Still use recitation.id from API response as it's the authoritative source
  }
  
  console.log('========================================');
  console.log('[RecitationDetailsPage] About to fetch tracks with assetId:', assetIdForTracks);
  console.log('[RecitationDetailsPage] assetId type:', typeof assetIdForTracks);
  console.log('[RecitationDetailsPage] URL recitationId (for reference):', recitationId);
  console.log('========================================');

  // Fetch tracks using the recitation ID as asset_id
  // The API endpoint /recitation-tracks/{asset_id}/ uses the recitation ID
  const tracks = await getRecitationTracksByAssetId(
    assetIdForTracks, // Use recitation.id (number) as asset_id
    reciterName,
    reciterImage,
    tenantId
  );

  console.log('========================================');
  console.log('[RecitationDetailsPage] Fetched tracks count:', tracks.length);
  if (tracks.length > 0) {
    console.log('[RecitationDetailsPage] First track audioUrl:', tracks[0].audioUrl);
    console.log('[RecitationDetailsPage] First track title:', tracks[0].title);
  }
  console.log('========================================');

  // Update tracks with reciter information (already set, but ensure consistency)
  const tracksWithReciterInfo = tracks.map(track => ({
    ...track,
    reciterName,
    image: reciterImage,
  }));

  // Use actual tracks from API - DO NOT fallback to mock data to avoid confusion
  // If no tracks found, show empty array (the component will handle it)
  const surahItems: RecitationItem[] = tracksWithReciterInfo;
  
  console.log('========================================');
  console.log('[RecitationDetailsPage] Final surahItems count:', surahItems.length);
  console.log('[RecitationDetailsPage] Using mock data?', surahItems.length === 0 && process.env.NODE_ENV === 'development' ? 'YES (empty, would use mock)' : 'NO (using API data)');
  console.log('========================================');

  return (
    <PageLayout tenant={tenant}>
      <div dir="rtl" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          {/* Head section: 2 parts. Part 1 (start): avatar column + info column (title/desc + tags row). Part 2: like/comment/share row + CTAs row. Same bg as hero. */}
          <section className="relative overflow-hidden rounded-[14px] border border-[#ebe8e8] bg-[#f6f6f4] px-6 py-6 shadow-sm">
            {/* Same bg pattern as hero section (home + recitations head) */}
            <div
              className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-12">
              {/* Part 1 (RTL start): column 1 = avatar, column 2 = info (row1: title+description, row2: tags) */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                <div className="relative h-[179px] w-[179px] shrink-0 overflow-hidden rounded-[24px] bg-white">
                  <AvatarImage
                    src={reciterImage}
                    alt={`صورة ${reciterName}`}
                    fill
                    className="object-cover"
                    priority
                    iconSize="h-24 w-24"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-6 justify-between h-full">
                  <div className="text-start">
                    <h1 className="text-[28px] font-semibold leading-tight text-black">
                      {reciterName}
                    </h1>
                    <p className="mt-2 text-[18px] leading-snug text-[#6a6a6a]">
                      {recitation.name || 'مصحف مرتل'}
                    </p>
                  </div>
                  {/* Tags: second row, start side */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* <span className="rounded-[4px] bg-white px-[12px] py-[8px] text-[12px] font-[500] text-[#1f2a37]">
                      مصحف مجود
                    </span> */}
                    {recitation.riwayah?.name && (
                      <span className="rounded-[4px] bg-white px-[12px] py-[8px] text-[12px] font-[500] text-[#1f2a37]">
                        رواية {recitation.riwayah.name}
                      </span>
                    )}
                    {recitation.madd_level && (
                      <span className="rounded-[4px] bg-white px-[12px] py-[8px] text-[12px] font-[500] text-[#1f2a37]">
                        {recitation.madd_level === 'tawassut' ? 'التوسط' : recitation.madd_level === 'qasr' ? 'قصر' : recitation.madd_level}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Part 2: row 1 = like, comment, share (4px radius); row 2 = 2 CTAs — aligned to end side */}
              <div className="flex flex-1 flex-col justify-between gap-6 mt-auto items-start lg:items-end">
                {/* <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#6a6a6a]">
                  <div className="flex items-center gap-2 rounded-[4px] border border-[#ebe8e8] bg-white px-3 py-2">
                    <FiHeart className="h-4 w-4 shrink-0" />
                    <span>1,456 إعجاب</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-[4px] border border-[#ebe8e8] bg-white px-3 py-2">
                    <FiMessageCircle className="h-4 w-4 shrink-0" />
                    <span>400 تعليق</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-[4px] border border-[#ebe8e8] bg-white px-3 py-2">
                    <FiShare2 className="h-4 w-4 shrink-0" />
                    <span>133 مشاركة</span>
                  </div>
                </div> */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="https://api.cms.itqan.dev/docs/" target="_blank">
                    <Button
                      variant="secondary"
                      className="gap-2 bg-[#0d121c] text-white hover:bg-[#0a0f17]"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" aria-hidden>
                        <g clipPath="url(#api-code-icon-clip)">
                          <path d="M17 8L18.8398 9.85008C19.6133 10.6279 20 11.0168 20 11.5C20 11.9832 19.6133 12.3721 18.8398 13.1499L17 15" stroke="#FAAF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 8L5.16019 9.85008C4.38673 10.6279 4 11.0168 4 11.5C4 11.9832 4.38673 12.3721 5.16019 13.1499L7 15" stroke="#FAAF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.5 4L9.5 20" stroke="#FAAF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="api-code-icon-clip">
                            <rect width="24" height="24" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      API
                    </Button>
                  </Link>
                  {/* <Button
                    variant="secondary"
                    className="gap-2 bg-[#1b3f2d] text-white hover:bg-[#152f22]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" aria-hidden>
                      <path opacity="0.3" d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" fill="#FAAF41"/>
                      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="#FAAF41" strokeWidth="1.5"/>
                      <path d="M12 16L12 8M12 16C11.2998 16 9.99153 14.0057 9.5 13.5M12 16C12.7002 16 14.0085 14.0057 14.5 13.5" stroke="#FAAF41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    تحميل المصحف كاملا
                  </Button> */}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <RecitationsPlayer
              recitations={surahItems}
              defaultSelected={surahItems[0]?.id}
              variant="details"
              listTitle="قائمة السور"
            />
          </section>

        </div>
      </div>
    </PageLayout>
  );
}
