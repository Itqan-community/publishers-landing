/**
 * Hero Section Component
 * 
 * Large banner section with title, description, image, and CTA
 * Matches Figma design with two-column layout
 */

import Image from 'next/image';
import Link from 'next/link';
import { HeroContent } from '@/types/tenant.types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckmarkBadgeIcon, TwitterIcon, InstagramIcon, TikTokIcon } from '@/components/ui/Icons';

interface HeroSectionProps {
  content: HeroContent;
  /** Base path for links: '' on custom domain, '/<tenantId>' on path-based */
  basePath?: string;
  statsCard?: {
    value: string;
    label: string;
    description: string;
  };
}

export function HeroSection({ content, basePath = '', statsCard }: HeroSectionProps) {
  const { title, description, image, ctaText, ctaLink } = content;
  const prefix = basePath || '';

  return (
    <section className="relative w-full" style={{ overflow: 'visible' }}>
      <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20" style={{ overflow: 'visible' }}>
        {/* RTL: Text on right (start), Image on left (end) */}
        {/* Figma: Image is 469px wide, text area is wider - adjust grid ratio */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
          {/* Text Column - Right side (start in RTL) */}
          <div className="order-1 lg:order-1 space-y-5 sm:space-y-6">
            <h1 className="text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-[var(--color-foreground)] leading-tight max-w-xl">
              {title}
            </h1>
            <p className="mb-8 max-w-width-lg text-md sm:text-lg md:text-xl text-[var(--color-text-paragraph)] leading-relaxed">
              {description}
            </p>

            {/* CTA Buttons - Figma: "تصفح القراء" (secondary/black) and "استمع الان" (primary/green with icon), gap 16px */}
            {/* RTL: align to start side (right) */}
            <div className="flex flex-wrap gap-4 pt-2 justify-start">
              {/* <Button variant="secondary" size="md" asChild>
                <Link href={`${prefix}/reciters`}>تصفح القراء</Link>
              </Button> */}
              <Button variant="primary" size="md" asChild>
                <Link href={ctaLink ? `${prefix}${ctaLink}` : `${prefix}/recitations`}>استمع الان</Link>
              </Button>
            </div>

            {/* Avatars - Figma: 4 avatars + +30 badge */}
            {/* <div className="flex items-center gap-4 pt-4 justify-start">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative w-12 h-12 rounded-full border-[1.5px] border-white shadow-sm overflow-hidden bg-[var(--color-bg-neutral-200)]"
                  >
                    <Image
                      src={`/images/avatar-${i}.jpg`}
                      alt="reciter"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ))}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[var(--color-primary)] text-[var(--color-text-oncolor)] border-[1.5px] border-white flex items-center justify-center text-lg font-bold shadow-sm">
                  +30
                </div>
              </div>
            </div> */}

            {/* Social icons with line between text and icons - Figma: line between text and icons */}
            <div className="flex items-center gap-4 text-[var(--color-primary)] text-lg pt-1 justify-start flex-wrap sm:flex-nowrap">
              <span className="text-sm text-[var(--color-text-paragraph)]">تابعنا على منصات التواصل الاجتماعي</span>
              <div className="hidden sm:block h-[1px] w-[140px] bg-[var(--color-primary)]" />
              <div className="flex items-center gap-4">
                {/* Figma: gap 15px, icons 24px */}
                <a href="#" aria-label="X" className="hover:opacity-80 transition-opacity">
                  <TwitterIcon className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a href="#" aria-label="TikTok" className="hover:opacity-80 transition-opacity">
                  <TikTokIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Image Column - Left side (end in RTL) - Commented out for now */}
          {/* 
          <div className="order-2 lg:order-2 relative">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[560px]">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-[var(--color-bg-card)]">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {statsCard && (
                <div className="absolute bottom-4 start-4 lg:bottom-10 lg:start-4 xl:start-[-32px] 2xl:start-[-95.5px]">
                  <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[191px] lg:h-[191px]" style={{ filter: 'drop-shadow(0 14px 36px rgba(0,0,0,0.12))' }}>
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 191 191"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0"
                    >
                      <path
                        d="M28.4707 123.264L0.707031 95.5L28.4707 67.7363V28.4707H67.7363L95.5 0.707031L123.264 28.4707H162.529V67.7363L190.293 95.5L162.529 123.264V162.529H123.264L95.5 190.293L67.7363 162.529H28.4707V123.264Z"
                        fill="var(--color-primary)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white leading-none px-4 py-3 sm:px-6 sm:py-5 pointer-events-none">
                      <div className="text-display-xs sm:text-display-sm lg:text-display-lg font-bold text-[var(--color-secondary)] leading-none mb-1 sm:mb-2">
                        {statsCard.value}
                      </div>
                      <div className="text-xs sm:text-sm lg:text-md font-medium text-[var(--color-text-oncolor)] text-center leading-normal">
                        <p className="mb-0">استماع على جميع</p>
                        <p>المنصات</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute top-4 end-2 sm:top-6 sm:end-4 lg:end-0 flex flex-col gap-2 sm:gap-3 items-start">
                {[
                  'مجموعة مختارة من أفضل القراء',
                  'تلاوات متنوعة بمختلف الروايات',
                ].map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-[var(--color-bg-card)] px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-sm ring-1 ring-[var(--color-border)] translate-x-0 xl:translate-x-[12%] 2xl:translate-x-[30%]"
                    style={{
                      minHeight: '42px',
                    }}
                  >
                    <span className="text-sm sm:text-md font-medium text-[var(--color-foreground)]">{item}</span>
                    <CheckmarkBadgeIcon className="w-6 h-6 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          */}
        </div>
      </div>
    </section>
  );
}

