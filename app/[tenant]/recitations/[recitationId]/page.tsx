import Image from 'next/image';
import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { RecitationsPlayer, RecitationItem } from '@/components/audio/AudioPlayer';
import { FiCode, FiDownload, FiMessageCircle, FiHeart, FiShare2 } from 'react-icons/fi';
import { getRecitationById } from '@/lib/recorded-mushafs';
import { getRecitationTracksByAssetId } from '@/lib/recitation-tracks';
import { getBackendUrl, resolveImageUrl } from '@/lib/utils';
import { AvatarImage } from '@/components/ui/AvatarImage';

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
  const recitation = await getRecitationById(recitationId);

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
      getBackendUrl()
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
    reciterImage
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
          <section className="rounded-[18px] border border-[#ebe8e8] bg-white px-6 py-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start">
              <div className="flex items-center gap-6 flex-row-reverse">
                <div className="flex h-[179px] w-[179px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#f4b400] bg-white p-0">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <AvatarImage
                      src={reciterImage}
                      alt={`صورة ${reciterName}`}
                      fill
                      className="object-cover"
                      priority
                      iconSize="h-24 w-24"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-[28px] font-semibold text-black">{reciterName}</h1>
                  <p className="mt-2 text-[18px] text-[#6a6a6a]">{recitation.name || 'مصحف مرتل'}</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#6a6a6a]">
                  <div className="flex items-center gap-2 rounded-full border border-[#ebe8e8] px-3 py-1">
                    <FiHeart className="h-4 w-4" />
                    <span>1,456 إعجاب</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-[#ebe8e8] px-3 py-1">
                    <FiMessageCircle className="h-4 w-4" />
                    <span>400 تعليق</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-[#ebe8e8] px-3 py-1">
                    <FiShare2 className="h-4 w-4" />
                    <span>133 مشاركة</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    className="gap-2 bg-[#0d121c] text-white hover:bg-[#0a0f17]"
                  >
                    <FiCode className="h-4 w-4" />
                    API
                  </Button>
                  <Button
                    variant="secondary"
                    className="gap-2 bg-[#1b3f2d] text-white hover:bg-[#152f22]"
                  >
                    <FiDownload className="h-4 w-4" />
                    تحميل للمصحف كاملًا
                  </Button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {recitation.riwayah?.name && (
                    <span className="rounded-[6px] bg-[#f3f3f3] px-4 py-[2px] text-[14px] text-[#1f2a37]">
                      رواية {recitation.riwayah.name}
                    </span>
                  )}
                  {recitation.madd_level && (
                    <span className="rounded-[6px] bg-[#f3f3f3] px-4 py-[2px] text-[14px] text-[#1f2a37]">
                      {recitation.madd_level === 'tawassut' ? 'التوسط' : recitation.madd_level === 'qasr' ? 'قصر' : recitation.madd_level}
                    </span>
                  )}
                  {recitation.year && (
                    <span className="rounded-[6px] bg-[#f3f3f3] px-4 py-[2px] text-[14px] text-[#1f2a37]">
                      سنة {recitation.year}
                    </span>
                  )}
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
