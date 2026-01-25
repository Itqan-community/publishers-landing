import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import { TenantConfig } from '@/types/tenant.types';

interface FooterProps {
  tenant: TenantConfig;
}

const PLATFORM_LABEL: Record<string, string> = {
  twitter: 'تويتر',
  instagram: 'انستجرام',
  tiktok: 'تيك توك',
};

function getSocialIconSrc(platform: string): string | null {
  const p = platform.toLowerCase();
  if (p === 'twitter') return '/icons/footer/x.png';
  if (p === 'instagram') return '/icons/footer/instagram.png';
  return null;
}

export const Footer: React.FC<FooterProps> = ({ tenant }) => {
  const { template, branding, content } = tenant;
  const footer = content.footer;

  if (template === 'saudi-center') {
    return (
      <footer className="bg-[#f6f4f1] border-t border-[#ebe8e8]" dir="rtl">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
          {/* RTL: logo+description at start (right), columns at end (left). lg:flex-row = first at start, second at end. */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Logo block at start (right in RTL). Same logo as Header. */}
            <div className="max-w-[387px]">
              <div className="flex flex-col items-start gap-1">
                <div className="relative h-[40px] w-[200px] sm:h-[44px] sm:w-[266px]">
                  <Image
                    src="/logos/full-logo.png"
                    alt={tenant.name}
                    fill
                    className="object-contain"
                  />
                </div>
                {footer.tagline && (
                  <div className="text-[12px] text-black">{footer.tagline}</div>
                )}
              </div>
              <p className="mt-6 text-[14px] leading-[1.5] text-black">
                {footer.description}
              </p>
            </div>

            {/* Four columns at end (left in RTL). Order: عنا (start/right), المصادر, تواصل معنا, تابعنا (end/left). */}
            <div className="flex flex-wrap justify-between gap-10 lg:gap-[53px]">
              {/* عنا — links aligned to start (right in RTL) */}
              {footer.links[0] && (
                <div className="text-start">
                  <p className="text-[16px] font-semibold text-black">{footer.links[0].label}</p>
                  <div className="mt-4 flex flex-col items-start gap-2 text-[12px] text-black">
                    {footer.links[0].items.map((item, i) => (
                      <Link key={i} href={item.href} className="hover:underline">
                        {item.text}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* المصادر — links aligned to start */}
              {footer.links[1] && (
                <div className="text-start">
                  <p className="text-[16px] font-semibold text-black">{footer.links[1].label}</p>
                  <div className="mt-4 flex flex-col items-start gap-2 text-[12px] text-black">
                    {footer.links[1].items.map((item, i) => (
                      <Link key={i} href={item.href} className="hover:underline">
                        {item.text}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* تواصل معنا — links aligned to start */}
              {footer.contact && (footer.contact.email || footer.contact.phone) && (
                <div className="text-start">
                  <p className="text-[16px] font-semibold text-black">تواصل معنا</p>
                  <div className="mt-4 flex flex-col items-start gap-2 text-[12px] text-black">
                    {footer.contact.email && (
                      <a href={`mailto:${footer.contact.email}`} className="hover:underline">
                        {footer.contact.email}
                      </a>
                    )}
                    {footer.contact.phone && (
                      <a href={`tel:${footer.contact.phone}`} className="hover:underline">
                        {footer.contact.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* تابعنا — no TikTok; links aligned to start */}
              {footer.social && (() => {
                const social = footer.social.filter((s) => s.platform.toLowerCase() !== 'tiktok');
                if (social.length === 0) return null;
                return (
                  <div className="text-start">
                    <p className="text-[16px] font-semibold text-black">تابعنا</p>
                    <div className="mt-4 flex flex-col items-start gap-3 text-[12px] text-black">
                      {social.map((s) => {
                        const label = PLATFORM_LABEL[s.platform.toLowerCase()] ?? s.platform;
                        const iconSrc = getSocialIconSrc(s.platform);
                        if (!iconSrc) return null;
                        return (
                          <a
                            key={s.platform}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-start gap-2 hover:underline"
                          >
                            <span>{label}</span>
                            <Image src={iconSrc} alt="" width={18} height={18} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Bottom bar — policy links aligned to start (right in RTL) */}
          <div className="mt-8 border-t border-[#ebe8e8] pt-6">
            <div className="flex flex-col gap-4 text-[12px] text-[#6a6a6a] md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center justify-start gap-6">
                <Link href="/privacy" className="hover:underline">
                  سياسة الخصوصية
                </Link>
                <Link href="/terms" className="hover:underline">
                  شروط الخدمة
                </Link>
                <Link href="/cookies" className="hover:underline">
                  إعدادات ملفات تعريف الارتباط
                </Link>
              </div>
              <span>{footer.copyright}</span>
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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
