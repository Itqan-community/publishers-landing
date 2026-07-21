import React from 'react';
import Image from 'next/image';
import { FeatureAwardIcon } from '@/components/ui/Icons';

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  iconSrc?: string;
}

export type AboutAppearance = 'default' | 'qiraat-archive';

const defaultTitleClass = 'text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-[var(--color-foreground)] leading-tight';

interface AboutSectionProps {
  id?: string;
  title: string;
  /** Optional; when omitted, description block is not rendered (e.g. Tahbeer). */
  description?: string;
  features: FeatureItem[];
  /** Icon color variant: tahbeer uses theme primary (brown), same as hero icons. */
  iconVariant?: 'default' | 'tahbeer';
  /** Optional class for the section title (e.g. Tahbeer: 39px font-semibold). */
  titleClassName?: string;
  /**
   * `qiraat-archive` — ruled manuscript feature list (soft sage discs, no card chrome).
   * Default preserves existing card grid.
   */
  appearance?: AboutAppearance;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  id,
  title,
  description,
  features,
  iconVariant = 'default',
  titleClassName,
  appearance = 'default',
}) => {
  const isArchive = appearance === 'qiraat-archive';

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 ${isArchive ? 'bg-[var(--color-paper,#E6E2D8)]' : 'bg-white'} ${id ? 'scroll-mt-20' : ''}`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 section-title-gap">
          <h2 className={titleClassName ?? defaultTitleClass}>
            {title}
          </h2>
          {isArchive && (
            <div
              className="h-px w-[64px] bg-[var(--color-rule-gold,#A68B4B)] opacity-60 -mt-1"
              aria-hidden="true"
            />
          )}
          {description != null && description !== '' && (
            <p className="text-md sm:text-lg md:text-xl text-[var(--color-text-paragraph)] leading-relaxed max-w-paragraph">
              {description}
            </p>
          )}
        </div>

        {isArchive ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 lg:gap-y-10">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="qiraat-about-item flex gap-4 items-start border-b border-[var(--color-rule-gold,#A68B4B)]/30 pb-8 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-[var(--about-icon-color,var(--color-primary))]"
                  style={{
                    backgroundColor:
                      'var(--about-icon-bg, color-mix(in srgb, var(--color-primary) 10%, white))',
                  }}
                >
                  {iconVariant === 'tahbeer' ? (
                    <FeatureAwardIcon variant="tahbeer" className="w-[26px] h-[26px]" />
                  ) : feature.iconSrc ? (
                    <Image
                      src={feature.iconSrc}
                      alt=""
                      width={26}
                      height={26}
                      className="object-contain"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-foreground)]">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-md sm:text-lg leading-relaxed text-[var(--color-text-paragraph)] mt-2 whitespace-pre-line">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative min-h-[218px] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden px-5 pt-5 sm:px-6 sm:pt-6"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-[var(--about-icon-color,var(--color-primary))]"
                  style={{
                    backgroundColor:
                      'var(--about-icon-bg, color-mix(in srgb, var(--color-primary) 10%, white))',
                  }}
                >
                  {iconVariant === 'tahbeer' ? (
                    <FeatureAwardIcon variant="tahbeer" className="w-[26px] h-[26px]" />
                  ) : feature.iconSrc ? (
                    <Image
                      src={feature.iconSrc}
                      alt=""
                      width={26}
                      height={26}
                      className="object-contain"
                    />
                  ) : null}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-foreground)] mt-6">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-md sm:text-lg leading-relaxed text-[var(--color-text-paragraph)] mt-3 whitespace-pre-line">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
