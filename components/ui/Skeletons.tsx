/**
 * Skeleton loader components for better loading UX
 * Page-specific variants that match actual layouts
 */

/**
 * Mushaf Card Skeleton - matches the actual mushaf card design
 */
export function MushafCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[10px] border border-[#ebe8e8] bg-white">
      {/* Image skeleton */}
      <div className="h-[180px] sm:h-[226px] w-full bg-gray-200" />

      {/* Content skeleton */}
      <div className="px-4 py-4 space-y-3">
        {/* Title */}
        <div className="h-6 w-3/4 rounded bg-gray-200" />

        {/* Description */}
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />

        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-24 rounded-full bg-gray-200" />
          <div className="h-7 w-20 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * Recitations Listing Page Skeleton
 * Matches the actual listing page: search bar + grid of cards
 */
export function RecitationsListSkeleton() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top section with background */}
      <div className="relative bg-[#f6f6f4] pb-10 pt-24 sm:pb-12 lg:pt-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 sm:space-y-6">
            {/* Title */}
            <div className="mx-auto h-8 w-48 sm:h-10 sm:w-64 rounded bg-gray-200" />

            {/* Description */}
            <div className="mx-auto h-5 w-full max-w-[384px] rounded bg-gray-200" />

            {/* Search + filter row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="h-12 sm:h-14 flex-1 rounded-lg bg-white shadow-sm" />
              <div className="h-12 sm:h-14 w-full sm:w-56 rounded-lg bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of mushaf cards */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <MushafCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Recitation Detail Page Skeleton
 * Matches the actual detail page: header + audio player layout
 */
export function RecitationDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Full-width top section (matches actual details page layout) */}
      <div className="relative bg-[#f6f6f4] pb-0">
        <div className="relative mx-auto max-w-[1280px] px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
          <div className="animate-pulse">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-6">
              {/* Avatar */}
              <div className="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] lg:h-[179px] lg:w-[179px] shrink-0 rounded-[24px] bg-gray-200" />

              {/* Info */}
              <div className="flex w-full flex-1 flex-col items-center gap-2 lg:items-start lg:gap-6">
                <div className="space-y-3 text-center lg:text-start w-full">
                  <div className="mx-auto lg:mx-0 h-7 w-48 sm:h-8 sm:w-64 rounded bg-gray-200" />
                  <div className="mx-auto lg:mx-0 h-5 w-36 sm:w-48 rounded bg-gray-200" />
                </div>
                {/* Tags */}
                <div className="flex justify-center gap-3 lg:justify-start">
                  <div className="h-8 w-28 rounded-[4px] bg-gray-200" />
                  <div className="h-8 w-24 rounded-[4px] bg-gray-200" />
                </div>
              </div>

              {/* Button placeholder */}
              <div className="w-full lg:w-auto mt-auto">
                <div className="h-10 w-full lg:w-24 rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio player section */}
      <div className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="animate-pulse mt-10">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Track list */}
            <div className="rounded-[12px] border border-[#ebe8e8] bg-white p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="h-8 w-32 sm:w-40 rounded bg-gray-200" />
                  <div className="h-10 w-full sm:w-48 rounded-lg bg-gray-200" />
                </div>
                <div className="space-y-2 pt-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg p-3 sm:p-4 border border-[#ebe8e8]">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                        <div className="h-3 w-1/2 rounded bg-gray-200" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-11 w-11 rounded-lg bg-gray-200" />
                        <div className="h-11 w-11 rounded-lg bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Player card */}
            <div className="rounded-[12px] border border-[#ebe8e8] bg-white p-4 sm:p-6">
              <div className="flex flex-col items-center gap-6">
                <div className="size-[160px] sm:size-[190px] lg:size-[214px] rounded-[30px] bg-gray-200" />
                <div className="w-full max-w-full sm:max-w-[280px] space-y-2">
                  <div className="h-3 w-20 mx-auto rounded bg-gray-200" />
                  <div className="h-1 w-full rounded-full bg-gray-200" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-[46px] w-[46px] rounded-[14px] bg-gray-200" />
                  <div className="h-[46px] w-[46px] rounded-[14px] bg-gray-200" />
                  <div className="h-[46px] w-[46px] rounded-[14px] bg-gray-200" />
                </div>
                <div className="w-full space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
