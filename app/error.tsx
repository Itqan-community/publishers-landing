'use client';

/**
 * Root-level error boundary.
 * Catches errors at the top of the app (outside [tenant] routes).
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      dir="rtl"
      style={{ background: 'linear-gradient(135deg, #193624 0%, #0f2318 100%)' }}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-[#faaf41]">خطأ</h1>
        <p className="text-xl text-white/70 mb-8 max-w-md mx-auto">
          حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-right max-w-lg mx-auto">
            <summary className="cursor-pointer text-sm text-white/50">
              تفاصيل الخطأ (للمطورين فقط)
            </summary>
            <pre className="mt-2 text-xs text-left bg-black/30 text-white/80 p-4 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={reset}
          className="inline-block bg-[#faaf41] hover:bg-[#e09d35] text-[#193624] font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          حاول مرة أخرى
        </button>
      </div>
    </div>
  );
}
