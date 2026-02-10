/**
 * 404 Not Found Page (Root Level)
 * 
 * Arabic-first, branded 404 page matching the app's RTL design.
 * Uses the default tenant's primary color for styling.
 */

import Link from 'next/link';
import { getDefaultTenantId } from '@/lib/tenant-config';

export default function NotFound() {
  const defaultTenantId = getDefaultTenantId();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      dir="rtl"
      style={{ background: 'linear-gradient(135deg, #193624 0%, #0f2318 100%)' }}
    >
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4 text-[#faaf41]">404</h1>
        <h2 className="text-3xl font-semibold mb-4 text-white">
          الصفحة غير موجودة
        </h2>
        <p className="text-xl text-white/70 mb-8 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href={`/${defaultTenantId}`}
          className="inline-block bg-[#faaf41] hover:bg-[#e09d35] text-[#193624] font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
