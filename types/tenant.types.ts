/**
 * Multi-Tenant Landing Page Types
 * 
 * This file defines all TypeScript interfaces for the multi-tenant landing page system.
 * These types ensure type safety across tenant configurations, templates, and components.
 */

// ==================== TENANT CONFIGURATION ====================

/** Backend API URLs per environment (development / localhost, staging, production). */
export interface TenantApiConfig {
  /** Development / localhost API base URL (e.g. https://staging.api.cms.itqan.dev) */
  development: string;
  /** Staging API base URL (e.g. https://staging.api.cms.itqan.dev) */
  staging: string;
  /** Production API base URL (e.g. https://api.cms.itqan.dev) */
  production: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  /** Primary/canonical domain for this tenant (e.g. saudi-recitations-center.com). Used for X-Tenant header. Staging uses staging--<domain>. */
  domain?: string;
  /** Additional domain aliases that map to this tenant. All domains (primary + additional) support staging--<domain> variants. */
  domains?: string[];
  /** Backend API base URLs per environment. Used when NEXT_PUBLIC_ENV is set (e.g. in Netlify). */
  api?: TenantApiConfig;
  branding: TenantBranding;
  features: TenantFeatures;
  content: TenantContent;
  cmsLinks: CMSLinks;
  template: TemplateType;
  /** SEO metadata for this tenant */
  seo?: TenantSEO;
  /** Analytics configuration */
  analytics?: TenantAnalytics;
}

export interface TenantSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  twitterImage?: string;
  twitterCard?: string;
}

export interface TenantAnalytics {
  googleAnalyticsId?: string;
}

export interface TenantBranding {
  logo: string;
  logoFull?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  font: string;
}

export interface TenantFeatures {
  speakers: boolean;
  statistics: boolean;
  readings: boolean;
  media: boolean;
  newsletter: boolean;
  governmentBanner?: boolean;
}

export interface TenantContent {
  hero: HeroContent;
  statistics?: StatisticsContent[];
  assetCategories?: AssetCategoryContent[];
  speakers?: SpeakerContent[];
  readings?: ReadingContent[];
  media?: MediaContent[];
  footer: FooterContent;
}

export interface CMSLinks {
  store: string;
  admin?: string;
  support?: string;
}

// ==================== CONTENT TYPES ====================

export interface HeroContent {
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface StatisticsContent {
  label: string;
  value: string | number;
  icon?: string;
  suffix?: string;
  description?: string;
}

export interface AssetCategoryContent {
  id: string;
  title: string;
  description: string;
  image: string;
  itemCount: number;
  link: string;
}

export interface SpeakerContent {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  audioSample?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ReadingContent {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  link: string;
}

// ==================== SAUDI CENTER: RECORDED MUSHAFS ====================

/**
 * BE-ready model for "Recorded Mushafs" cards.
 * Keep this independent from UI so we can swap the data source (mock → API) without refactors.
 */
export interface RecordedMushaf {
  id: string;
  title: string;
  description: string;
  riwayaLabel?: string; // e.g. "برواية حفص"

  reciter: {
    id: string;
    name: string;
    /** Avatar URL from API; empty string when API does not provide image (show person icon). */
    avatarImage: string;
  };

  /**
   * Card visuals (from BE / CMS)
   * For this card, the top area is a solid color (no image).
   */
  visuals: {
    topBackgroundColor: string;
    /** Outline color for the mushaf/book graphic; varies per card (e.g. blue, green, purple). */
    outlineColor?: string;
  };

  /** Optional year (e.g. 1970) for metadata line. */
  year?: number;

  /**
   * Optional badges/icons shown on the card (shape/color should match design).
   */
  badges?: Array<{
    id: string;
    label: string;
    icon?: 'headphones' | 'book' | 'mic' | 'sparkle';
    tone?: 'green' | 'gold' | 'gray';
  }>;

  href: string;
}

export interface MediaContent {
  id: string;
  title: string;
  type: 'video' | 'podcast' | 'image';
  thumbnail: string;
  url: string;
  duration?: string;
}

export interface FooterContent {
  description: string;
  tagline?: string;
  contact?: { email?: string; phone?: string };
  links: {
    label: string;
    items: { text: string; href: string }[];
  }[];
  social: {
    platform: string;
    url: string;
    icon: string;
  }[];
  copyright: string;
}

// ==================== TEMPLATE TYPES ====================

export type TemplateType = 'default' | 'magazine' | 'minimal' | 'saudi-center' | 'tahbeer';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  sections: TemplateSectionType[];
}

export type TemplateSectionType =
  | 'hero'
  | 'statistics'
  | 'asset-categories'
  | 'speakers'
  | 'readings'
  | 'media'
  | 'newsletter'
  | 'footer';

// ==================== TENANT RESOLUTION ====================

export interface TenantResolutionStrategy {
  type: 'subdomain' | 'path' | 'domain';
  resolve: (request: TenantRequest) => string | null;
}

export interface TenantRequest {
  hostname: string;
  pathname: string;
  headers: Record<string, string>;
}

export interface TenantContext {
  tenant: TenantConfig | null;
  /** Base path for links: '' on custom domain, '/<tenantId>' on path-based (e.g. localhost/saudi-center) */
  basePath: string;
  loading: boolean;
  error: string | null;
}

