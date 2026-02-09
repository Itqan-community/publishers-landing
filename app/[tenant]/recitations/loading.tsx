import { RecitationsListSkeleton } from '@/components/ui/Skeletons';

/**
 * Shown while the recitations listing page (and its API calls) are loading.
 * Uses skeleton screens for better UX instead of generic spinner.
 */
export default function RecitationsLoading() {
  return <RecitationsListSkeleton />;
}
