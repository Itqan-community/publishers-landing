/**
 * Magazine Template
 * 
 * Alternative template focused on editorial content:
 * - Hero
 * - Statistics
 * - Featured Readings
 * - Asset Categories (if available)
 * - Footer
 */

import { TenantConfig } from '@/types/tenant.types';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatisticsSection } from '@/components/sections/StatisticsSection';
import { AssetCategoriesSection } from '@/components/sections/AssetCategoriesSection';
import { FooterSection } from '@/components/sections/FooterSection';

interface MagazineTemplateProps {
  tenant: TenantConfig;
  basePath?: string;
}

export function MagazineTemplate({ tenant, basePath: _basePath }: MagazineTemplateProps) {
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

      {/* Footer Section */}
      <FooterSection
        content={content.footer}
        logo={branding.logo}
        tenantName={name}
      />
    </div>
  );
}

