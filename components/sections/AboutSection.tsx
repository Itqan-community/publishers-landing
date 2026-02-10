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
    <section id={id} className={`py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title + description stacked */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[32px] md:text-[39px] font-semibold text-black leading-[1.4]">
            {title}
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#343434] leading-[30.4px] max-w-[740px]">
            {description}
          </p>
        </div>

        {/* Cards (row 2) - 4 in a row on desktop */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative h-[218px] rounded-[11px] border border-[#ebe8e8] bg-white overflow-hidden px-6 pt-6"
            >
              <div className="absolute start-6 top-5 h-[59px] w-[59px] rounded-[12px] bg-[#eef9f2] flex items-center justify-center">
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
              <h3 className="text-[20px] font-semibold text-black mt-[58px]">
                {feature.title}
              </h3>
              {feature.description && (
                <p className="text-[19px] leading-[30.4px] text-[#343434] mt-3 whitespace-pre-line">
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
