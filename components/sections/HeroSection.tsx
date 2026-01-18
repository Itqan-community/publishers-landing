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
  statsCard?: {
    value: string;
    label: string;
    description: string;
  };
}

export function HeroSection({ content, statsCard }: HeroSectionProps) {
  const { title, description, image, ctaText, ctaLink } = content;

  return (
    <section className="relative w-full" style={{ minHeight: '772px', overflow: 'visible' }}>
      {/* Base background - solid color only */}
      <div
        className="absolute inset-0"
        style={{
          background: '#f6f6f4', // Figma BG color from design
        }}
      />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20" style={{ overflow: 'visible' }}>
        {/* RTL: Text on right (start), Image on left (end) */}
        {/* Figma: Image is 469px wide, text area is wider - adjust grid ratio */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          {/* Text Column - Right side (start in RTL) */}
          <div className="order-1 lg:order-1 space-y-6 text-right">
            <h1 className="text-[39px] font-semibold text-black leading-[1.4]">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl ml-auto">
              {description}
            </p>

            {/* CTA Buttons - Figma: "تصفح القراء" (secondary/black) and "استمع الان" (primary/green with icon), gap 16px */}
            {/* RTL: align to start side (right) */}
            <div className="flex flex-wrap gap-4 pt-2 justify-start">
              <Button variant="secondary" size="md" asChild>
                <Link href="/saudi-center/reciters">تصفح القراء</Link>
              </Button>
              <Button variant="primary" size="md" asChild>
                <Link href={ctaLink || '/saudi-center/recitations'}>استمع الان</Link>
              </Button>
            </div>

            {/* Avatars - Figma: 4 avatars + +30 badge */}
            <div className="flex items-center gap-4 pt-4 justify-start">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <Image
                    key={i}
                    src={`/images/avatar-${i}.jpg`}
                    alt="reciter"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-[#193624] text-white border-2 border-white flex items-center justify-center text-[19px] font-bold shadow-sm">
                  +30
                </div>
              </div>
            </div>

            {/* Social icons with line between text and icons - Figma: line between text and icons */}
            <div className="flex items-center gap-4 text-[#193624] text-lg pt-1 justify-start">
              <span className="text-sm text-gray-700">تابعنا على منصات التواصل الاجتماعي</span>
              <div className="h-[1px] w-[140px] bg-[#193624]" />
              <div className="flex items-center gap-[15px]">
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

          {/* Image Column - Left side (end in RTL) */}
          <div className="order-2 lg:order-2 relative">
            {/* Container with overflow visible to show star and chips */}
            <div className="relative w-full h-[560px]">
              {/* Image container - overflow hidden only for image */}
              <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-xl ring-1 ring-black/5 bg-white">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              {/* Floating stats badge - Figma: star shape, center aligned to left edge of image (end side in RTL) */}
              {/* Positioned outside image container so it's visible */}
              {statsCard && (
                <div className="absolute bottom-6 left-4 lg:bottom-10 lg:left-[-95.5px]"> {/* Inside on mobile, aligned to edge on desktop */}
                  <div className="relative w-[191px] h-[191px]" style={{ filter: 'drop-shadow(0 14px 36px rgba(0,0,0,0.12))' }}>
                    {/* Star SVG - inline for better control */}
                    <svg
                      width="191"
                      height="191"
                      viewBox="0 0 191 191"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute inset-0"
                    >
                      <path
                        d="M28.4707 123.264L0.707031 95.5L28.4707 67.7363V28.4707H67.7363L95.5 0.707031L123.264 28.4707H162.529V67.7363L190.293 95.5L162.529 123.264V162.529H123.264L95.5 190.293L67.7363 162.529H28.4707V123.264Z"
                        fill="#193624"
                      />
                    </svg>
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white leading-none px-6 py-5 pointer-events-none">
                      <div className="text-[44.332px] font-bold text-[#faaf41] leading-none mb-2">
                        {statsCard.value}
                      </div>
                      <div className="text-[16px] font-medium text-white text-center leading-[1.5]">
                        <p className="mb-0">استماع على جميع</p>
                        <p>المنصات</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature pills - Figma: 30% of chip should be outside image (70% inside) */}
              {/* Position at edge, then move 30% of chip width outside */}
              <div className="absolute top-6 right-4 lg:right-0 flex flex-col gap-3 items-start">
                {[
                  'مجموعة مختارة من أفضل القراء',
                  'تلاوات متنوعة بمختلف الروايات',
                ].map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-[50px] shadow-sm ring-1 ring-gray-100 translate-x-0 lg:translate-x-[30%]"
                    style={{ 
                      minHeight: '42px',
                    }}
                  >
                    <span className="text-[16px] font-medium text-black">{item}</span>
                    <CheckmarkBadgeIcon className="w-6 h-6 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

