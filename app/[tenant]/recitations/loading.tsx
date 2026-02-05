import { BouncingDots } from '@/components/ui/BouncingDots';

/**
 * Shown while the recitations listing page (and its API calls) are loading.
 * Uses the same bouncing-dots indicator as the filter-change overlay.
 */
export default function RecitationsLoading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center bg-[#f6f4f1]"
      dir="rtl"
    >
      <BouncingDots className="scale-150" aria-label="جاري تحميل المصاحف" />
    </div>
  );
}
