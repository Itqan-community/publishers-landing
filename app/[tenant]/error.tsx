'use client';

import { useTenant } from '@/components/providers/TenantProvider';
import { PageLayout } from '@/components/layout/PageLayout';

/**
 * Error boundary for tenant routes
 * Catches runtime errors and displays a user-friendly message
 */
export default function TenantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { tenant } = useTenant();

  // Fallback in case tenant is not available
  const primaryColor = tenant?.branding?.primaryColor || '#193624';

  return (
    <PageLayout tenant={tenant!}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4" dir="rtl">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#343434]">
            حدث خطأ غير متوقع
          </h2>

          <p className="text-lg text-[#6a6a6a] mb-6">
            نعتذر عن هذا الإزعاج. يرجى المحاولة مرة أخرى.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-right">
              <summary className="cursor-pointer text-sm text-[#6a6a6a]">
                تفاصيل الخطأ (للمطورين فقط)
              </summary>
              <pre className="mt-2 text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}

          <button
            onClick={reset}
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
