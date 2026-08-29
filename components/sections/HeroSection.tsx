/**
 * Hero Section Component
 *
 * Supports two variants:
 * - default: Gov-style layout (KSA Gov design system), single column, no image/avatars.
 * - legacy: Two-column layout with image, star stats badge; optionally CTA, avatars, social, big logo (Figma Tahbeer).
 *
 * Optional appearance `qiraat-archive` (legacy only): quieter manuscript hero — no floating
 * badges/stats over image; ruled strip + ink fade. Defaults preserve Tahbeer.
 */

import Image from 'next/image';
import Link from 'next/link';
import { HeroContent } from '@/types/tenant.types';
import { Button } from '@/components/ui/Button';
import { CheckmarkBadgeIcon, TwitterIcon, InstagramIcon, TikTokIcon, YouTubeIcon, FacebookIcon } from '@/components/ui/Icons';

/** Shape of social link from tenant footer config */
export type SocialLink = { platform: string; url: string };

export type HeroAppearance = 'default' | 'qiraat-archive';

interface HeroSectionProps {
  content: HeroContent;
  /** Base path for links: '' on custom domain, '/<tenantId>' on path-based */
  basePath?: string;
  /** Legacy variant: optional social links (youtube, twitter). When provided, renders these instead of hardcoded. */
  socialLinks?: SocialLink[];
  statsCard?: {
    value: string;
    label: string;
    description: string;
    /** Optional class for label + description text under the value (e.g. lg:text-[14px] for Qiraat). */
    descriptionClassName?: string;
  };
  /**
   * - default: Gov-style (current), single column, CSS variables.
   * - legacy: Two-column layout with image, star badge; optional CTA/avatars/social/logo per legacy* props.
   */
  variant?: 'default' | 'legacy';
  /** Legacy only: show large logo (e.g. Tahbeer Figma). */
  legacyLogoUrl?: string;
  /** Legacy only: show CTA button. Default true. */
  legacyShowCta?: boolean;
  /** Legacy only: show avatars row. Default true. */
  legacyShowAvatars?: boolean;
  /** Legacy only: show social row. Default true. */
  legacyShowSocial?: boolean;
  /** Legacy only: CheckmarkBadgeIcon variant — 'tahbeer' uses theme primary (brown). */
  legacyCheckmarkVariant?: 'default' | 'tahbeer';
  /** Legacy only: floating badges on the hero image. Defaults to Tahbeer (صابر عبد الحكم). */
  legacyBadgeItems?: string[];
  /**
   * Presentation chrome. `qiraat-archive` = manuscript calm (no overlay badges/stats).
   * Default preserves existing Tahbeer/legacy layout.
   */
  appearance?: HeroAppearance;
}

function SocialIcons({
  socialLinks,
  legacyCheckmarkVariant,
}: {
  socialLinks?: SocialLink[];
  legacyCheckmarkVariant: 'default' | 'tahbeer';
}) {
  if (!socialLinks || socialLinks.length === 0) return null;
  const iconClass = 'w-6 h-6';
  const linkClass = 'hover:opacity-80 transition-opacity';
  return (
    <>
      {socialLinks
        .filter((s) =>
          ['youtube', 'twitter', 'instagram', 'facebook', 'tiktok'].includes(s.platform.toLowerCase()),
        )
        .map((s) => {
          const pl = s.platform.toLowerCase();
          if (pl === 'youtube') {
            return (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={linkClass}>
                <YouTubeIcon variant={legacyCheckmarkVariant} className={iconClass} />
              </a>
            );
          }
          if (pl === 'twitter') {
            return (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label="X" className={linkClass}>
                <TwitterIcon variant={legacyCheckmarkVariant} className={iconClass} />
              </a>
            );
          }
          if (pl === 'instagram') {
            return (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={linkClass}>
                <InstagramIcon variant={legacyCheckmarkVariant} className={iconClass} />
              </a>
            );
          }
          if (pl === 'facebook') {
            return (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={linkClass}>
                <FacebookIcon variant={legacyCheckmarkVariant} className={iconClass} />
              </a>
            );
          }
          if (pl === 'tiktok') {
            return (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={linkClass}>
                <TikTokIcon variant={legacyCheckmarkVariant} className={iconClass} />
              </a>
            );
          }
          return null;
        })}
    </>
  );
}

export function HeroSection({
  content,
  basePath = '',
  socialLinks,
  statsCard,
  variant = 'default',
  legacyLogoUrl,
  legacyShowCta = true,
  legacyShowAvatars = true,
  legacyShowSocial = true,
  legacyCheckmarkVariant = 'default',
  legacyBadgeItems = ['بصوت  الشيخ صابر عبد الحكم', 'تلاوات متنوعة بمختلف الروايات'],
  appearance = 'default',
}: HeroSectionProps) {
  const { title, description, image, ctaText, ctaLink } = content;
  const prefix = basePath || '';
  const isArchive = appearance === 'qiraat-archive';

  if (variant === 'legacy') {
    const statsLine1 = statsCard?.label?.split('\n')[0] ?? 'استماع على جميع';
    const statsLine2 = statsCard?.description ?? statsCard?.label?.split('\n')[1] ?? 'المنصات';

    if (isArchive) {
      return (
        <section className="relative w-full min-h-[420px] sm:min-h-[550px] lg:min-h-[720px]" style={{ overflow: 'visible' }}>
          <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:py-16 lg:py-20 min-h-[420px] sm:min-h-[550px] lg:min-h-[720px] flex" style={{ overflow: 'visible' }}>
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14 items-center w-full">
              <div className="order-1 self-stretch lg:order-1 flex flex-col justify-center items-start text-start space-y-5 sm:space-y-6">
                {legacyLogoUrl && (
                  <div className="w-full flex justify-start max-lg:hidden qiraat-hero-ink">
                    <Image
                      src={legacyLogoUrl}
                      alt=""
                      width={280}
                      height={120}
                      className="h-16 sm:h-20 md:h-28 lg:h-36 w-auto object-contain object-start"
                      priority
                      sizes="(max-width: 1024px) 200px, 280px"
                    />
                  </div>
                )}
                <h1 className="qiraat-hero-ink text-[36px] md:text-[44px] lg:text-[48px] font-bold text-[var(--color-foreground)] leading-[1.35] max-w-xl">
                  {title}
                </h1>
                <div
                  className="qiraat-hero-ink-delay h-px w-[72px] bg-[var(--color-rule-gold,#A68B4B)] opacity-70"
                  aria-hidden="true"
                />
                <p className="qiraat-hero-ink-delay text-[18px] md:text-[22px] text-[var(--color-text-paragraph)] leading-relaxed max-w-xl">
                  {description}
                </p>
                {(legacyBadgeItems.length > 0 || statsCard) && (
                  <div className="qiraat-hero-ink-delay-2 flex flex-col gap-2 w-full max-w-xl pt-1">
                    {legacyBadgeItems.map((item) => (
                      <p
                        key={item}
                        className="text-[15px] sm:text-[16px] font-medium text-[var(--color-foreground)] flex items-center gap-2"
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0"
                          aria-hidden="true"
                        />
                        {item}
                      </p>
                    ))}
                    {statsCard && (
                      <p className="text-[14px] sm:text-[15px] text-[var(--color-text-paragraph)] mt-1 border-s-2 border-[var(--color-primary)] ps-3">
                        <span className="font-semibold text-[var(--color-foreground)]">{statsCard.value}</span>
                        {' '}
                        {statsLine1}
                        {statsLine2 ? ` — ${statsLine2}` : ''}
                      </p>
                    )}
                  </div>
                )}
                {legacyShowCta && (
                  <div className="qiraat-hero-ink-delay-2 flex flex-wrap gap-4 pt-2 justify-start">
                    <Button variant="primary" size="md" asChild>
                      <Link href={ctaLink ? `${prefix}${ctaLink}` : `${prefix}/recitations`}>
                        {ctaText ?? 'استمع الان'}
                      </Link>
                    </Button>
                  </div>
                )}
                {legacyShowSocial && (
                  <div className="qiraat-hero-ink-delay-2 flex mt-auto items-center gap-4 text-[var(--hero-social-color,var(--color-primary))] text-lg pt-2 justify-start flex-wrap sm:flex-nowrap">
                    <span className="text-sm text-[var(--color-text-paragraph)]">تابعنا على منصات التواصل الاجتماعي</span>
                    <div className="hidden sm:block h-px w-[100px] bg-[var(--color-primary)] opacity-60" />
                    <div className="flex items-center gap-[15px]">
                      <SocialIcons socialLinks={socialLinks} legacyCheckmarkVariant={legacyCheckmarkVariant} />
                    </div>
                  </div>
                )}
              </div>
              <div className="order-2 lg:order-2 relative hidden lg:block qiraat-hero-ink-delay">
                <div className="relative w-full h-[480px] xl:h-[560px]">
                  <div className="relative w-full h-full rounded-[12px] overflow-hidden ring-1 ring-[var(--color-rule-gold,#A68B4B)]/40">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="relative w-full min-h-[420px] sm:min-h-[550px] lg:min-h-[772px]" style={{ overflow: 'visible' }}>
        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 min-h-[420px] sm:min-h-[550px] lg:min-h-[772px] flex" style={{ overflow: 'visible' }}>
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center w-full">
            {/* Text Column - Right side (start in RTL); Figma: big logo, title, description, no CTA/avatars when legacy* set */}
            <div className="order-1 self-stretch lg:order-1 flex flex-col justify-center items-start text-start space-y-5 sm:space-y-6">
              {legacyLogoUrl && (
                <div className="w-full flex justify-start max-lg:hidden">
                  <Image
                    src={legacyLogoUrl}
                    alt=""
                    width={280}
                    height={120}
                    className="h-16 sm:h-20 md:h-28 lg:h-40 w-auto object-contain object-start"
                    priority
                    sizes="(max-width: 1024px) 200px, 280px"
                  />
                </div>
              )}
              <h1 className="text-[34px] md:text-[39px] font-semibold text-[var(--color-foreground)] leading-[1.4] max-w-xl">
                {title}
              </h1>
              <p className="text-[22px] md:text-[29px] text-[var(--color-text-paragraph)] leading-relaxed max-w-xl">
                {description}
              </p>
              {legacyShowCta && (
                <div className="flex flex-wrap gap-4 pt-2 justify-start">
                  <Button variant="primary" size="md" asChild>
                    <Link href={ctaLink ? `${prefix}${ctaLink}` : `${prefix}/recitations`}>
                      {ctaText ?? 'استمع الان'}
                    </Link>
                  </Button>
                </div>
              )}
              {legacyShowAvatars && (
                <div className="flex items-center gap-4 pt-4 justify-start">
                  <div className="flex -space-x-3 rtl:space-x-reverse">
                    {[1, 2, 3, 4].map((i) => (
                      <Image
                        key={i}
                        src={`/images/avatar-${i}.jpg`}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-white shadow-sm object-cover"
                      />
                    ))}
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white border-2 border-white flex items-center justify-center text-[19px] font-bold shadow-sm">
                      +30
                    </div>
                  </div>
                </div>
              )}
              {legacyShowSocial && (
                <div className="flex mt-auto items-center gap-4 text-[var(--hero-social-color,var(--color-primary))] text-lg pt-1 justify-start flex-wrap sm:flex-nowrap">
                  <span className="text-sm text-[var(--color-text-paragraph)]">تابعنا على منصات التواصل الاجتماعي</span>
                  <div className="hidden sm:block h-[1px] w-[140px] bg-[var(--color-primary)]" />
                  <div className="flex items-center gap-[15px] text-[var(--hero-social-color,var(--color-primary))]">
                    <SocialIcons socialLinks={socialLinks} legacyCheckmarkVariant={legacyCheckmarkVariant} />
                  </div>
                </div>
              )}
            </div>
            {/* Image Column - Left side (end in RTL); hidden on phone/tablet, visible on lg+ */}
            <div className="order-2 lg:order-2 relative hidden lg:block">
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[560px]">
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
                {statsCard && (
                  <div className="absolute bottom-4 end-4 lg:bottom-10 lg:end-4 xl:end-[-32px] 2xl:end-[-95.5px]">
                    <div
                      className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] lg:w-[191px] lg:h-[191px]"
                      style={{ filter: 'drop-shadow(0 14px 36px rgba(0,0,0,0.12))' }}
                    >
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--hero-stats-text,white)] leading-none px-4 py-3 sm:px-6 sm:py-5 pointer-events-none">
                        <div className="text-[24px] sm:text-[32px] lg:text-[44.332px] font-bold leading-none mb-1 sm:mb-2">
                          {statsCard.value}
                        </div>
                        <div
                          className={
                            statsCard.descriptionClassName ??
                            'text-[10px] sm:text-[13px] lg:text-[16px] font-medium text-center leading-[1.5]'
                          }
                        >
                          <p className="mb-0">{statsLine1}</p>
                          <p>{statsLine2}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-10 start-0 flex flex-col gap-2 sm:gap-3 items-start">
                  {legacyBadgeItems.map((item) => (
                    <div
                      key={item}
                      className="flex min-w-[300px] items-center gap-2 bg-white px-6 rounded-[50px] shadow-sm ring-1 ring-gray-100 translate-x-[-8%] md:translate-x-[-8%] lg:translate-x-[36%] xl:translate-x-[40%]"
                      style={{ height: '54px', minHeight: '54px' }}
                    >
                      <CheckmarkBadgeIcon variant={legacyCheckmarkVariant} className="w-6 h-6 flex-shrink-0 text-[var(--color-primary)]" />
                      <span className="text-[13px] sm:text-[16px] font-medium text-[var(--color-foreground)]">
                        {item}
                      </span>
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

  /* ─── default (gov-style) variant ─── */
  return (
    <section className="relative w-full pt-[60px] sm:pt-[40px] md:pt-0[20px] lg:pt-0" style={{ overflow: 'visible' }}>
      <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20" style={{ overflow: 'visible' }}>
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
          <div className="order-1 lg:order-1 space-y-5 sm:space-y-6">
            <h1 className="text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-[var(--color-foreground)] leading-tight max-w-xl">
              {title}
            </h1>
            <p className="mb-8 max-w-width-lg text-md sm:text-lg md:text-xl text-[var(--color-text-paragraph)] leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 justify-start">
              <Button variant="primary" size="md" asChild>
                <Link href={ctaLink ? `${prefix}${ctaLink}` : `${prefix}/recitations`}>استمع الان</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-[var(--hero-social-color,var(--color-primary))] text-lg pt-1 justify-start flex-wrap sm:flex-nowrap">
              <span className="text-sm text-[var(--color-text-paragraph)]">تابعنا على منصات التواصل الاجتماعي</span>
              <div className="hidden sm:block h-[1px] w-[140px] bg-[var(--hero-social-color,var(--color-primary))]" />
              <div className="flex items-center gap-4 text-[var(--hero-social-color,var(--color-primary))]">
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
        </div>
      </div>
    </section>
  );
}
