/**
 * Root-level loading state.
 * Shown when navigating to the root page before tenant resolution.
 */
export default function RootLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      dir="rtl"
      style={{ background: 'linear-gradient(135deg, #193624 0%, #0f2318 100%)' }}
    >
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#faaf41] border-t-transparent" />
        <p className="mt-4 text-white/70 text-lg">جاري التحميل...</p>
      </div>
    </div>
  );
}
