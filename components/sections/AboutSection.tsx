import React from 'react';
import Image from 'next/image';

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  iconSrc?: string;
}

interface AboutSectionProps {
  id?: string;
  title: string;
  description: string;
  features: FeatureItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  id,
  title,
  description,
  features,
}) => {
  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title + description stacked */}
        <div className="flex flex-col gap-4">
          <h2 className="text-display-xs sm:text-display-sm md:text-display-lg font-semibold text-[var(--color-foreground)] leading-tight">
            {title}
          </h2>
          <p className="text-md sm:text-lg md:text-xl text-[var(--color-text-paragraph)] leading-relaxed max-w-[740px]">
            {description}
          </p>
        </div>

        {/* Cards (row 2) - 4 in a row on desktop */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative min-h-[218px] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden px-5 pt-5 sm:px-6 sm:pt-6"
            >
              <div className="absolute start-6 top-5 h-[59px] w-[59px] rounded-lg bg-[#eef9f2] flex items-center justify-center">
                {feature.iconSrc && (
                  <Image
                    src={feature.iconSrc}
                    alt=""
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-foreground)] mt-[58px]">
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
