/**
 * Skeleton loader components for better loading UX
 * Page-specific variants that match actual layouts
 */

/**
 * Mushaf Card Skeleton - matches the actual mushaf card design
 */
export function MushafCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[18px] border border-[#ebe8e8] bg-white">
      {/* Image skeleton */}
      <div className="h-[240px] w-full bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-6 space-y-3">
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
      <div className="relative bg-[#f6f6f4] pb-12 pt-24 lg:pt-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            {/* Title */}
            <div className="h-10 w-64 rounded bg-gray-200" />

            {/* Description */}
            <div className="h-5 w-96 max-w-full rounded bg-gray-200" />

            {/* Search + filter row */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="h-14 flex-1 rounded-lg bg-white shadow-sm" />
              <div className="h-14 w-full sm:w-56 rounded-lg bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of mushaf cards */}
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
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
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          {/* Header card */}
          <div className="rounded-[14px] border border-[#ebe8e8] bg-[#f6f6f4] p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="h-32 w-32 shrink-0 rounded-full bg-gray-200" />

              <div className="flex-1 space-y-4">
                {/* Title */}
                <div className="h-8 w-3/4 rounded bg-gray-200" />

                {/* Description */}
                <div className="h-5 w-1/2 rounded bg-gray-200" />

                {/* Tags/Badges */}
                <div className="flex gap-2">
                  <div className="h-8 w-28 rounded-full bg-gray-200" />
                  <div className="h-8 w-24 rounded-full bg-gray-200" />
                  <div className="h-8 w-20 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Audio player section - 2 columns */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Track list */}
            <div className="rounded-[12px] border border-[#ebe8e8] bg-white p-6">
              <div className="space-y-4">
                {/* List title + search */}
                <div className="flex items-center justify-between gap-4">
                  <div className="h-8 w-40 rounded bg-gray-200" />
                  <div className="h-10 w-48 rounded-lg bg-gray-200" />
                </div>

                {/* Track items */}
                <div className="space-y-2 pt-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg p-4 border border-[#ebe8e8]">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                        <div className="h-3 w-1/2 rounded bg-gray-200" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-9 w-9 rounded-lg bg-gray-200" />
                        <div className="h-9 w-9 rounded-lg bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Player card */}
            <div className="rounded-[12px] border border-[#ebe8e8] bg-white p-6">
              <div className="flex flex-col items-center gap-6">
                {/* Album art */}
                <div className="h-[214px] w-[214px] rounded-full bg-gray-200" />

                {/* Time/Progress */}
                <div className="w-full max-w-[280px] space-y-2">
                  <div className="h-3 w-20 mx-auto rounded bg-gray-200" />
                  <div className="h-1 w-full rounded-full bg-gray-200" />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="h-14 w-14 rounded-full bg-gray-200" />
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                </div>

                {/* Track info */}
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
