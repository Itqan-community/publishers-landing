import React from 'react';
import Image from 'next/image';

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  iconSrc?: string;
}

interface AboutSectionProps {
  title: string;
  description: string;
  features: FeatureItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  description,
  features,
}) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Text Content - Right side in RTL */}
          <div className="order-2 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Features Grid - Left side in RTL, 4 cards in a row */}
          <div className="order-1 lg:order-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative h-[218px] rounded-[11px] border border-[#ebe8e8] bg-white overflow-hidden px-6 pt-6"
              >
                <div className="absolute right-6 top-5 h-[59px] w-[59px] rounded-[12px] bg-[#eef9f2] flex items-center justify-center">
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
                <h3 className="text-[20px] font-semibold text-black text-right mt-[58px]">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-[19px] leading-[30.4px] text-[#343434] text-right mt-3 whitespace-pre-line">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
