import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import { TenantConfig } from '@/types/tenant.types';

interface FooterProps {
  tenant: TenantConfig;
  /** Base path for links: '' on custom domain, '/<tenantId>' on path-based */
  basePath?: string;
}

function withBasePath(href: string, basePath: string): string {
  if (!basePath || !href.startsWith('/')) return href;
  return basePath + href;
}

/* ── Inline SVG icons (stroke-style, white, 24×24) ── */

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 21L10.548 13.452M21 3L13.452 10.548M13.452 10.548L18 3H15L10.548 13.452M13.452 10.548L21 21H18L10.548 13.452" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4.75 1.875C3.157 1.875 1.875 3.157 1.875 4.75V19.25C1.875 20.843 3.157 22.125 4.75 22.125H19.25C20.843 22.125 22.125 20.843 22.125 19.25V4.75C22.125 3.157 20.843 1.875 19.25 1.875H4.75ZM7.5 9V17H5V9H7.5ZM6.25 6C6.94 6 7.5 6.56 7.5 7.25C7.5 7.94 6.94 8.5 6.25 8.5C5.56 8.5 5 7.94 5 7.25C5 6.56 5.56 6 6.25 6ZM19 17H16.5V13C16.5 11.83 15.75 11 14.75 11C13.75 11 13 11.83 13 13V17H10.5V9H13V10.31C13.59 9.54 14.47 9 15.5 9C17.43 9 19 10.57 19 12.5V17Z" stroke="white" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="white" />
    </svg>
  );
}


/* ── Icon button wrapper (32×32 bordered square) ── */
function IconButton({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  const cls = "flex items-center justify-center size-[32px] rounded-[4px] border border-white/40 shrink-0 hover:bg-white/10 transition-colors";
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} aria-label={label}>
      {children}
    </button>
  );
}

export const Footer: React.FC<FooterProps> = ({ tenant, basePath = '' }) => {
  const { template, branding, content } = tenant;
  const footer = content.footer;

  if (template === 'saudi-center') {
    return (
      <footer className="bg-[#193624] text-white" dir="rtl">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex flex-col gap-12">

          {/* ═══════ Top: 4 link columns ═══════
              RTL: start = right. First flex child → rightmost.
              DOM order: ملخص, روابط مهمة, الاتصال والدعم, تابعنا على
              Visual (RTL): ملخص(right) … تابعنا على(left) ✓ */}
          <div className="flex flex-wrap gap-6 pt-4 pb-10">

            {/* Column 1 — ملخص (rightmost in RTL) */}
            <div className="flex-1 min-w-[180px] flex flex-col gap-2 items-start">
              <div className="w-full border-b border-white/30 pb-2">
                <p className="text-[16px] font-medium leading-[24px] text-start">ملخص</p>
              </div>
              <div className="flex flex-col gap-2 items-start text-[14px] leading-[20px]">
                <Link href={withBasePath('/about', basePath)} className="hover:underline">حول المركز</Link>
                <Link href={withBasePath('/privacy', basePath)} className="hover:underline">الخصوصية وشروط الاستخدام</Link>
                <Link href={withBasePath('/how-to-use', basePath)} className="hover:underline">كيفية استخدام المنصة</Link>
                <Link href={withBasePath('/news', basePath)} className="hover:underline">الأخبار والأحداث</Link>
                <Link href={withBasePath('/sla', basePath)} className="hover:underline">إحصائيات اتفاقية مستوى الخدمة</Link>
              </div>
            </div>

            {/* Column 2 — روابط مهمة */}
            <div className="flex-1 min-w-[180px] flex flex-col gap-2 items-start">
              <div className="w-full border-b border-white/30 pb-2">
                <p className="text-[16px] font-medium leading-[24px] text-start">روابط مهمة</p>
              </div>
              <div className="flex flex-col gap-2 items-start text-[14px] leading-[20px]">
                <Link href={withBasePath('/about', basePath)} className="hover:underline">من نحن</Link>
                <Link href={withBasePath('/contact', basePath)} className="hover:underline">تواصل معنا</Link>
                <Link href={withBasePath('/faq', basePath)} className="hover:underline">الأسئلة الشائعة</Link>
                <Link href={withBasePath('/terms', basePath)} className="hover:underline">الشروط</Link>
                <Link href={withBasePath('/privacy', basePath)} className="hover:underline">الخصوصية</Link>
              </div>
            </div>

            {/* Column 3 — الاتصال والدعم */}
            <div className="flex-1 min-w-[180px] flex flex-col gap-2 items-start">
              <div className="w-full border-b border-white/30 pb-2">
                <p className="text-[16px] font-medium leading-[24px] text-start">الاتصال والدعم</p>
              </div>
              <div className="flex flex-col gap-2 items-start text-[14px] leading-[20px]">
                <Link href={withBasePath('/cookies', basePath)} className="hover:underline">إعدادات ملفات تعريف الارتباط</Link>
                <Link href={withBasePath('/contact', basePath)} className="hover:underline">تواصل معنا</Link>
                <Link href={withBasePath('/share', basePath)} className="hover:underline">شارك معنا</Link>
                <Link href={withBasePath('/complaints', basePath)} className="hover:underline">تقديم شكوى</Link>
                <Link href={withBasePath('/report', basePath)} className="hover:underline">الإبلاغ عن الفساد</Link>
              </div>
            </div>

            {/* Column 4 — تابعنا على + أدوات الاتاحة (leftmost in RTL) */}
            <div className="flex-1 min-w-[180px] flex flex-col gap-8 items-start">
              {/* Social media */}
              <div className="w-full flex flex-col gap-2 items-start">
                <div className="w-full border-b border-white/30 pb-2">
                  <p className="text-[16px] font-medium leading-[24px] text-start">تابعنا على</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <IconButton href="https://twitter.com/saudicenter" label="X (Twitter)">
                    <XIcon />
                  </IconButton>
                  <IconButton href="https://linkedin.com/company/saudicenter" label="LinkedIn">
                    <LinkedInIcon />
                  </IconButton>
                  <IconButton href="https://instagram.com/saudicenter" label="Instagram">
                    <InstagramIcon />
                  </IconButton>
                </div>
              </div>

            </div>
          </div>

          {/* ═══════ Bottom: Legal (start/right) + Logo (end/left) ═══════
              RTL flex-row: first child → right, last child → left.
              DOM order: Legal first → right, Logo second → left ✓ */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between py-4">
            {/* Legal info — at start (right in RTL) */}
            <div className="flex flex-col gap-6 items-start">
              {/* Quick links row */}
              <div className="flex flex-wrap gap-4 items-center text-[14px] leading-[20px]">
                <Link href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">خريطة الموقع</Link>
              </div>

              {/* Copyright & last modified */}
              <div className="flex flex-col gap-2 items-start">
                <p className="text-[14px] font-semibold leading-[20px] text-start">
                  {footer.copyright || 'جميع الحقوق محفوظة لهيئة الحكومة الرقمية © 2024'}
                </p>
                <p className="text-[14px] leading-[20px] text-start">
                  تاريخ آخر تعديل: ١٢ شعبان ١٤٤٧ - Feb 10, 2026
                </p>
              </div>
            </div>

            {/* Logos — at end (left in RTL) */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="relative h-[40px] w-[200px] sm:h-[44px] sm:w-[266px]">
                <Image
                  src="/logos/full-logo-dark-bg.svg"
                  alt={tenant.name}
                  fill
                  className="object-contain"
                  sizes="266px"
                />
              </div>
              <a href="https://www.vision2030.gov.sa/" target="_blank" rel="noopener noreferrer" aria-label="رؤية السعودية 2030">
                <Image
                  src="/logos/2030-vision-logo.svg"
                  alt="رؤية السعودية 2030"
                  width={112}
                  height={76}
                  className="h-[44px] w-auto"
                />
              </a>
            </div>
          </div>

        </div>
      </footer>
    );
  }

  // Default template
  const socialLinks = {
    twitter: footer.social?.find((s) => s.platform.toLowerCase() === 'twitter')?.url,
    instagram: footer.social?.find((s) => s.platform.toLowerCase() === 'instagram')?.url,
    tiktok: footer.social?.find((s) => s.platform.toLowerCase() === 'tiktok')?.url,
  };
  const copyright = footer.copyright || `© ${new Date().getFullYear()} ${tenant.name}. جميع الحقوق محفوظة.`;

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="relative w-48 h-12">
                <Image
                  src={branding.logo}
                  alt={tenant.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {footer.description}
            </p>
            {footer.social && footer.social.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">
                  تابعنا على منصات التواصل الاجتماعي
                </p>
                <div className="flex gap-4">
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-200 text-gray-600"
                      aria-label="Twitter"
                    >
                      <FaTwitter size={18} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-200 text-gray-600"
                      aria-label="Instagram"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-200 text-gray-600"
                      aria-label="TikTok"
                    >
                      <FaTiktok size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {footer.links?.map((linkGroup, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold mb-4 text-gray-900">
                {linkGroup.label}
              </h3>
              <ul className="space-y-3">
                {linkGroup.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-start">
            {copyright}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-primary transition-colors">
              شروط الخدمة
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-primary transition-colors">
              إعدادات ملفات تعريف الارتباط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
