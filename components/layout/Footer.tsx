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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.94353 2.21547C2.05038 2.00649 2.2653 1.875 2.5 1.875H6.66667C6.86736 1.875 7.05584 1.97137 7.17334 2.13407L11.2867 7.82945L17.0581 2.05806C17.3021 1.81398 17.6979 1.81398 17.9419 2.05806C18.186 2.30214 18.186 2.69786 17.9419 2.94194L12.028 8.85589L18.0067 17.1341C18.1441 17.3243 18.1633 17.5756 18.0565 17.7845C17.9496 17.9935 17.7347 18.125 17.5 18.125H13.3333C13.1326 18.125 12.9442 18.0286 12.8267 17.8659L8.71333 12.1706L2.94194 17.9419C2.69787 18.186 2.30214 18.186 2.05806 17.9419C1.81398 17.6979 1.81398 17.3021 2.05806 17.0581L7.97201 11.1441L1.99333 2.86593C1.85591 2.67566 1.83668 2.42444 1.94353 2.21547ZM3.72235 3.125L13.6529 16.875H16.2777L6.3471 3.125H3.72235Z" fill="white" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.04163 3.5415C1.04163 2.16079 2.16091 1.0415 3.54163 1.0415C4.92234 1.0415 6.04163 2.16079 6.04163 3.5415C6.04163 4.92222 4.92234 6.0415 3.54163 6.0415C2.16091 6.0415 1.04163 4.92222 1.04163 3.5415ZM3.54163 2.2915C2.85127 2.2915 2.29163 2.85115 2.29163 3.5415C2.29163 4.23186 2.85127 4.7915 3.54163 4.7915C4.23198 4.7915 4.79163 4.23186 4.79163 3.5415C4.79163 2.85115 4.23198 2.2915 3.54163 2.2915Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M3.29601 7.29151H3.78726C4.14794 7.29146 4.47863 7.29143 4.74764 7.32759C5.04387 7.36742 5.35698 7.46113 5.6145 7.71865C5.87202 7.97616 5.96572 8.28927 6.00555 8.5855C6.04172 8.85451 6.04168 9.1852 6.04164 9.54588L6.04164 16.7038C6.04168 17.0645 6.04172 17.3952 6.00555 17.6642C5.96572 17.9604 5.87202 18.2735 5.6145 18.531C5.35698 18.7886 5.04387 18.8823 4.74764 18.9221C4.47863 18.9583 4.14793 18.9582 3.78725 18.9582H3.29601C2.93533 18.9582 2.60464 18.9583 2.33563 18.9221C2.03939 18.8823 1.72629 18.7886 1.46877 18.531C1.21125 18.2735 1.11754 17.9604 1.07771 17.6642C1.04155 17.3952 1.04159 17.0645 1.04163 16.7038L1.04163 9.54589C1.04159 9.18521 1.04155 8.85451 1.07771 8.5855C1.11754 8.28927 1.21125 7.97616 1.46877 7.71865C1.72629 7.46113 2.03939 7.36742 2.33563 7.32759C2.60464 7.29143 2.93533 7.29146 3.29601 7.29151ZM2.35266 8.60254L2.35469 8.60139C2.3563 8.60055 2.35906 8.5992 2.36327 8.59747C2.38142 8.59001 2.42172 8.57726 2.50219 8.56645C2.67779 8.54284 2.92279 8.54151 3.3333 8.54151H3.74997C4.16047 8.54151 4.40548 8.54284 4.58108 8.56645C4.66154 8.57726 4.70184 8.59001 4.71999 8.59747C4.7242 8.5992 4.72696 8.60055 4.72857 8.60139L4.7306 8.60254L4.73175 8.60457C4.73259 8.60618 4.73394 8.60894 4.73567 8.61315C4.74313 8.6313 4.75588 8.6716 4.7667 8.75206C4.7903 8.92767 4.79163 9.17267 4.79163 9.58318L4.79163 16.6665C4.79163 17.077 4.7903 17.322 4.7667 17.4976C4.75588 17.5781 4.74313 17.6184 4.73567 17.6365C4.73394 17.6407 4.73259 17.6435 4.73175 17.6451L4.7306 17.6471L4.72857 17.6483C4.72696 17.6491 4.7242 17.6505 4.71999 17.6522C4.70184 17.6597 4.66154 17.6724 4.58108 17.6832C4.40548 17.7068 4.16047 17.7082 3.74997 17.7082H3.3333C2.92279 17.7082 2.67779 17.7068 2.50219 17.6832C2.42172 17.6724 2.38142 17.6597 2.36327 17.6522C2.35906 17.6505 2.3563 17.6491 2.35469 17.6483L2.35266 17.6471L2.35152 17.6451C2.35067 17.6435 2.34933 17.6407 2.3476 17.6365C2.34013 17.6184 2.32739 17.5781 2.31657 17.4976C2.29296 17.322 2.29163 17.077 2.29163 16.6665L2.29163 9.58318C2.29163 9.17267 2.29296 8.92767 2.31657 8.75206C2.32739 8.6716 2.34013 8.6313 2.3476 8.61315C2.34933 8.60894 2.35067 8.60618 2.35152 8.60457L2.35266 8.60254Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.54601 7.29151C9.78733 7.29149 10.7592 7.29147 10.9437 7.30837C11.1432 7.32665 11.3605 7.36866 11.5697 7.49111C11.7858 7.61749 11.9656 7.79735 12.092 8.01338L12.102 8.03079C12.7601 7.56609 13.5545 7.29171 14.4139 7.29171C16.6599 7.29171 18.9583 9.20355 18.9583 11.6667L18.9572 16.2878C18.9572 16.6484 18.9571 16.979 18.9209 17.248C18.881 17.5441 18.7873 17.8572 18.5298 18.1146C18.2723 18.372 17.9592 18.4657 17.663 18.5055C17.3941 18.5417 17.0635 18.5417 16.7029 18.5416H16.2126C15.852 18.5417 15.5213 18.5417 15.2523 18.5055C14.956 18.4657 14.6429 18.372 14.3854 18.1145C14.1279 17.857 14.0342 17.5438 13.9944 17.2476C13.9582 16.9786 13.9582 16.6479 13.9583 16.2872L13.9583 12.4999C13.9583 12.1187 13.6762 11.8749 13.4065 11.8749C12.9755 11.8749 12.7438 12.0402 12.5846 12.3046C12.3973 12.6155 12.2917 13.1072 12.2917 13.7499L12.2917 16.7038C12.2917 17.0645 12.2917 17.3952 12.2556 17.6642C12.2157 17.9604 12.122 18.2735 11.8645 18.531C11.607 18.7886 11.2939 18.8823 10.9976 18.9221C10.7286 18.9583 10.3979 18.9582 10.0373 18.9582H9.54599C9.18532 18.9582 8.85463 18.9583 8.58563 18.9221C8.28939 18.8823 7.97629 18.7886 7.71877 18.531C7.46125 18.2735 7.36754 17.9604 7.32771 17.6642C7.29155 17.3952 7.29159 17.0645 7.29163 16.7038L7.29163 9.54589C7.29159 9.18521 7.29155 8.85451 7.32771 8.5855C7.36754 8.28927 7.46125 7.97616 7.71877 7.71865C7.97629 7.46113 8.28939 7.36742 8.58563 7.32759C8.85463 7.29143 9.18533 7.29146 9.54601 7.29151ZM9.58329 8.5415C9.17279 8.5415 8.92778 8.54283 8.75218 8.56644C8.69579 8.56425 8.57973 8.5983 8.56656 8.75206C8.54295 8.92766 8.54163 9.17266 8.54163 9.58317L8.54163 16.6665C8.54163 17.077 8.54295 17.322 8.56656 17.4976C8.57662 17.5992 8.6945 17.6637 8.75218 17.6832C8.92778 17.7068 9.17279 17.7082 9.58329 17.7082H9.99998C10.4105 17.7082 10.6555 17.7068 10.8311 17.6832C10.8884 17.6688 11.0058 17.6114 11.0167 17.4976C11.0403 17.322 11.0416 17.077 11.0416 16.6665L11.0417 13.7499C11.0417 13.012 11.156 12.2537 11.5138 11.6597C11.8995 11.0193 12.5378 10.6249 13.4065 10.6249C14.4366 10.6249 15.2083 11.5005 15.2083 12.4999V16.2499C15.2083 16.6604 15.2096 16.9054 15.2332 17.081C15.2332 17.2128 15.3128 17.2348 15.375 17.2521C15.3914 17.2566 15.4066 17.2608 15.4188 17.2667C15.5944 17.2903 15.8394 17.2916 16.2499 17.2916L16.6656 17.2916C17.076 17.2916 17.3209 17.2903 17.4965 17.2667C17.5543 17.2452 17.6724 17.1781 17.6821 17.0811C17.7057 16.9055 17.7071 16.6606 17.7072 16.2502L17.7083 11.6666C17.7082 9.98763 16.0672 8.5417 14.4139 8.5417C13.516 8.5417 12.7036 8.98073 12.1641 9.68987C12.0017 9.90335 11.7212 9.9894 11.467 9.90372C11.2128 9.81803 11.0417 9.57971 11.0417 9.31148C11.0417 9.03734 11.041 8.87399 11.03 8.7535C11.0232 8.62745 10.8936 8.56742 10.8297 8.55315C10.7092 8.54212 10.5458 8.5415 10.2717 8.5415L9.58329 8.5415Z" fill="white" />
    </svg>

  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.62504 10.0002C5.62504 7.58392 7.5838 5.62516 10 5.62516C12.4163 5.62516 14.375 7.58392 14.375 10.0002C14.375 12.4164 12.4163 14.3752 10 14.3752C7.5838 14.3752 5.62504 12.4164 5.62504 10.0002ZM10 6.87516C8.27415 6.87516 6.87504 8.27427 6.87504 10.0002C6.87504 11.7261 8.27415 13.1252 10 13.1252C11.7259 13.1252 13.125 11.7261 13.125 10.0002C13.125 8.27427 11.7259 6.87516 10 6.87516Z" fill="white" />
      <path d="M14.5899 6.25016C15.0501 6.25016 15.4232 5.87707 15.4232 5.41683C15.4232 4.95659 15.0501 4.5835 14.5899 4.5835H14.5824C14.1222 4.5835 13.7491 4.95659 13.7491 5.41683C13.7491 5.87707 14.1222 6.25016 14.5824 6.25016H14.5899Z" fill="white" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.0477 1.4585C11.8733 1.45849 13.3072 1.45848 14.4267 1.60899C15.5739 1.76323 16.4841 2.08576 17.1993 2.80092C17.9144 3.51609 18.237 4.4263 18.3912 5.57352C18.5417 6.69303 18.5417 8.12692 18.5417 9.9525V10.0478C18.5417 11.8734 18.5417 13.3073 18.3912 14.4268C18.237 15.574 17.9144 16.4842 17.1993 17.1994C16.4841 17.9146 15.5739 18.2371 14.4267 18.3913C13.3072 18.5419 11.8733 18.5418 10.0477 18.5418H9.9524C8.12682 18.5418 6.6929 18.5419 5.57339 18.3913C4.42618 18.2371 3.51597 17.9146 2.8008 17.1994C2.08564 16.4842 1.76311 15.574 1.60887 14.4268C1.45835 13.3073 1.45836 11.8734 1.45837 10.0478V9.95252C1.45836 8.12693 1.45835 6.69303 1.60887 5.57352C1.76311 4.4263 2.08564 3.51609 2.8008 2.80092C3.51597 2.08576 4.42618 1.76323 5.57339 1.60899C6.6929 1.45848 8.12679 1.45849 9.95237 1.4585H10.0477ZM5.73995 2.84784C4.73135 2.98345 4.12889 3.2406 3.68469 3.68481C3.24048 4.12901 2.98333 4.73147 2.84772 5.74008C2.7097 6.76666 2.70837 8.11652 2.70837 10.0002C2.70837 11.8838 2.7097 13.2337 2.84772 14.2603C2.98333 15.2689 3.24048 15.8713 3.68469 16.3155C4.12889 16.7597 4.73135 17.0169 5.73995 17.1525C6.76654 17.2905 8.1164 17.2918 10 17.2918C11.8837 17.2918 13.2335 17.2905 14.2601 17.1525C15.2687 17.0169 15.8712 16.7597 16.3154 16.3155C16.7596 15.8713 17.0168 15.2689 17.1524 14.2603C17.2904 13.2337 17.2917 11.8838 17.2917 10.0002C17.2917 8.11652 17.2904 6.76666 17.1524 5.74008C17.0168 4.73147 16.7596 4.12901 16.3154 3.68481C15.8712 3.2406 15.2687 2.98345 14.2601 2.84784C13.2335 2.70982 11.8837 2.7085 10 2.7085C8.1164 2.7085 6.76654 2.70982 5.73995 2.84784Z" fill="white" />
    </svg>

  );
}


/* ── Icon button wrapper (32×32 bordered square) ── */
function IconButton({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  const cls = "flex items-center justify-center size-8 rounded-xs border border-white/40 shrink-0 hover:bg-white/10 transition-colors";
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
                <p className="text-md font-medium text-start">ملخص</p>
              </div>
              <div className="flex flex-col gap-2 items-start text-sm">
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
                <p className="text-md font-medium text-start">روابط مهمة</p>
              </div>
              <div className="flex flex-col gap-2 items-start text-sm">
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
                <p className="text-md font-medium text-start">الاتصال والدعم</p>
              </div>
              <div className="flex flex-col gap-2 items-start text-sm">
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
                  <p className="text-md font-medium text-start">تابعنا على</p>
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
              <div className="flex flex-wrap gap-4 items-center text-sm">
                <Link href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">خريطة الموقع</Link>
              </div>

              {/* Copyright & last modified */}
              <div className="flex flex-col gap-2 items-start">
                <p className="text-sm font-semibold text-start">
                  {footer.copyright || 'جميع الحقوق محفوظة لهيئة الحكومة الرقمية © 2024'}
                </p>
                <p className="text-sm text-start">
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

  if (template === 'tahbeer') {
    const footerLogo = branding.logoFull ?? branding.logo;
    return (
      <footer className="bg-[var(--color-primary)] text-white" dir="rtl">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex flex-col gap-10">
          <div className="flex flex-wrap gap-8 pt-4 pb-6">
            {/* Logo + description (start/right in RTL) */}
            <div className="flex-1 min-w-[200px] flex flex-col gap-4 items-start">
              <div className="relative h-10 w-[140px] sm:h-12 sm:w-[180px]">
                <Image
                  src={footerLogo}
                  alt={tenant.name}
                  fill
                  className="object-contain object-start"
                  sizes="180px"
                />
              </div>
              <p className="text-sm text-white/90 max-w-xs text-start">
                {footer.description}
              </p>
            </div>
            {/* 4 columns from tenant config */}
            {footer.links?.map((linkGroup, index) => (
              <div key={index} className="flex-1 min-w-[140px] flex flex-col gap-2 items-start">
                <div className="w-full border-b border-white/30 pb-2">
                  <p className="text-md font-medium text-start">{linkGroup.label}</p>
                </div>
                <div className="flex flex-col gap-2 items-start text-sm">
                  {linkGroup.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={withBasePath(item.href, basePath)}
                      className="text-white/90 hover:text-white hover:underline"
                    >
                      {item.text}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {/* تواصل معنا + تابعنا */}
            <div className="flex-1 min-w-[180px] flex flex-col gap-4 items-start">
              {footer.contact && (
                <div className="flex flex-col gap-1 text-sm">
                  <div className="w-full border-b border-white/30 pb-2">
                    <p className="text-md font-medium text-start">تواصل معنا</p>
                  </div>
                  {footer.contact.email && (
                    <a href={`mailto:${footer.contact.email}`} className="text-white/90 hover:text-white hover:underline">
                      {footer.contact.email}
                    </a>
                  )}
                  {footer.contact.phone && (
                    <a href={`tel:${footer.contact.phone}`} className="text-white/90 hover:text-white hover:underline">
                      {footer.contact.phone}
                    </a>
                  )}
                </div>
              )}
              {footer.social && footer.social.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="w-full border-b border-white/30 pb-2">
                    <p className="text-md font-medium text-start">تابعنا</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {footer.social.map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center size-8 rounded-xs border border-white/40 hover:bg-white/10 transition-colors"
                        aria-label={s.platform}
                      >
                        {s.platform.toLowerCase() === 'twitter' && <XIcon />}
                        {s.platform.toLowerCase() === 'instagram' && <InstagramIcon />}
                        {s.platform.toLowerCase() === 'tiktok' && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="white" aria-hidden><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1.05-.08 6.33 6.33 0 0 0-6.33 6.34v6.92A6.34 6.34 0 0 0 13.36 19V9.45a6.84 6.84 0 0 0 1.05.08v3.45a4.85 4.85 0 0 0 3.77 4.22 4.82 4.82 0 0 0 4.41-1.07V6.69z" /></svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-white/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/90 text-center sm:text-start">
              {footer.copyright}
            </p>
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
