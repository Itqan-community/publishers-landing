/**
 * Default Template
 * 
 * Full-featured landing page template with all sections:
 * - Hero
 * - Statistics
 * - Asset Categories
 * - Speakers
 * - Footer
 */

import { TenantConfig } from '@/types/tenant.types';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatisticsSection } from '@/components/sections/StatisticsSection';
import { AssetCategoriesSection } from '@/components/sections/AssetCategoriesSection';
import { SpeakersSection } from '@/components/sections/SpeakersSection';
import { FooterSection } from '@/components/sections/FooterSection';

interface DefaultTemplateProps {
  tenant: TenantConfig;
  basePath?: string;
}

export function DefaultTemplate({ tenant, basePath: _basePath }: DefaultTemplateProps) {
  const { content, branding, name } = tenant;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection content={content.hero} />

      {/* Statistics Section */}
      {content.statistics && content.statistics.length > 0 && (
        <StatisticsSection statistics={content.statistics} />
      )}

      {/* Asset Categories Section */}
      {content.assetCategories && content.assetCategories.length > 0 && (
        <AssetCategoriesSection categories={content.assetCategories} />
      )}

      {/* Speakers Section */}
      {content.speakers && content.speakers.length > 0 && (
        <SpeakersSection speakers={content.speakers} />
      )}

      {/* Footer Section */}
      <FooterSection
        content={content.footer}
        logo={branding.logo}
        tenantName={name}
      />
    </div>
  );
}

