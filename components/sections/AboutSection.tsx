import React from 'react';
import Image from 'next/image';
import { FeatureAwardIcon } from '@/components/ui/Icons';

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  iconSrc?: string;
}

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
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  id,
  title,
  description,
  features,
  iconVariant = 'default',
  titleClassName,
}) => {
  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title + optional description */}
        <div className="flex flex-col gap-4 section-title-gap">
          <h2 className={titleClassName ?? defaultTitleClass}>
            {title}
          </h2>
          {description != null && description !== '' && (
            <p className="text-md sm:text-lg md:text-xl text-[var(--color-text-paragraph)] leading-relaxed max-w-paragraph">
              {description}
            </p>
          )}
        </div>

        {/* Cards (row 2) - 4 in a row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative min-h-[218px] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden px-5 pt-5 sm:px-6 sm:pt-6"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, white)' }}>
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
      </div>
    </section>
  );
};
