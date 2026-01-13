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
    <section className="relative w-full overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 20% 20%, rgba(25,54,36,0.05) 0%, rgba(25,54,36,0) 60%), #f6f6f4',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full h-[560px] rounded-[32px] overflow-hidden shadow-xl ring-1 ring-black/5 bg-white">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Floating stats badge */}
              {statsCard && (
                <div className="absolute -left-6 bottom-10">
                  <div
                    className="text-white font-bold text-3xl leading-tight px-6 py-5"
                    style={{
                      backgroundColor: '#193624',
                      clipPath:
                        'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                      boxShadow: '0 14px 36px rgba(0,0,0,0.12)',
                      minWidth: '150px',
                    }}
                  >
                    <div className="text-3xl md:text-4xl text-[#f4b400]">
                      {statsCard.value}
                    </div>
                    <div className="text-sm font-medium">استماع على جميع المنصات</div>
                  </div>
                </div>
              )}

              {/* Feature pills */}
              <div className="absolute right-6 top-6 flex flex-col gap-3 items-start">
                {[
                  'مجموعة مختارة من أفضل القراء',
                  'تلاوات متنوعة بمختلف الروايات',
                ].map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm ring-1 ring-gray-100"
                    style={{ minHeight: '42px' }}
                  >
                    <span className="text-sm font-semibold text-gray-900">{item}</span>
                    <Image
                      src="https://www.figma.com/api/mcp/asset/b1d19621-909a-45af-9cac-d83b3f5ef139"
                      alt="check"
                      width={20}
                      height={20}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2 space-y-6 text-right">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl ml-auto">
              {description}
            </p>

            {ctaText && ctaLink && (
              <div className="flex flex-wrap gap-3 pt-2 justify-end">
                <Button variant="primary" size="md" asChild>
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
                <Button variant="secondary" size="md" asChild>
                  <Link href="/saudi-center/reciters">تصفح القراء</Link>
                </Button>
              </div>
            )}

            {/* Avatars + social */}
            <div className="flex items-center gap-4 pt-4 justify-end">
              <div className="flex -space-x-3">
                {[
                  'https://www.figma.com/api/mcp/asset/7a8e48ea-ad3c-4672-bbb7-163c99af8163',
                  'https://www.figma.com/api/mcp/asset/0e350a03-b77d-44b7-b884-3686d0f05090',
                  'https://www.figma.com/api/mcp/asset/32023742-2b55-4c28-9122-901d02325c07',
                ].map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt="reciter"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white shadow-sm"
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-[#193624] text-white border-2 border-white flex items-center justify-center text-sm font-bold shadow-sm">
                  +30
                </div>
              </div>
              <div className="h-[1px] flex-1 bg-[#193624]" />
            </div>

            <div className="flex items-center gap-4 text-[#193624] text-lg pt-1 justify-end">
              <span className="text-sm text-gray-700">تابعنا على منصات التواصل الاجتماعي</span>
              <div className="flex items-center gap-3 text-xl">
                <a href="#" aria-label="Instagram" className="hover:text-primary">
                  <Image
                    src="https://www.figma.com/api/mcp/asset/4315a3eb-d963-4b11-839c-8c28d6c54385"
                    alt="insta"
                    width={22}
                    height={22}
                  />
                </a>
                <a href="#" aria-label="TikTok" className="hover:text-primary">
                  <Image
                    src="https://www.figma.com/api/mcp/asset/655215e7-5469-4049-90d9-742d679073c8"
                    alt="tiktok"
                    width={22}
                    height={22}
                  />
                </a>
                <a href="#" aria-label="X" className="hover:text-primary">
                  <Image
                    src="https://www.figma.com/api/mcp/asset/eebb4916-552a-413d-8fb4-b5bd237adc38"
                    alt="x"
                    width={22}
                    height={22}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

