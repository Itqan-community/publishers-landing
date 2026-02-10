'use client';

import { useTenant } from '@/components/providers/TenantProvider';
import { PageLayout } from '@/components/layout/PageLayout';
import Link from 'next/link';

/**
 * Tenant-branded 404 Not Found page
 * Uses TenantProvider to adapt styling to each tenant's branding
 */
export default function TenantNotFound() {
  const { tenant } = useTenant();

  // Fallback in case tenant is not available (shouldn't happen in practice)
  if (!tenant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4">الصفحة غير موجودة</p>
      </div>
    );
  }

  return (
    <PageLayout tenant={tenant}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4" dir="rtl">
        <div className="text-center">
          {/* 404 in tenant's primary color */}
          <h1
            className="text-6xl sm:text-7xl lg:text-9xl font-bold mb-4"
            style={{ color: tenant.branding.primaryColor }}
          >
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[#343434]">
            الصفحة غير موجودة
          </h2>

          <p className="text-lg sm:text-xl text-[#6a6a6a] mb-8 max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>

          <Link
            href={`/`}
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-colors"
            style={{
              backgroundColor: tenant.branding.primaryColor,
              opacity: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
