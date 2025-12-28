/**
 * Multi-Tenant Landing Page Types
 * 
 * This file defines all TypeScript interfaces for the multi-tenant landing page system.
 * These types ensure type safety across tenant configurations, templates, and components.
 */

// ==================== TENANT CONFIGURATION ====================

export interface TenantConfig {
  id: string;
  name: string;
  branding: TenantBranding;
  features: TenantFeatures;
  content: TenantContent;
  cmsLinks: CMSLinks;
  template: TemplateType;
}

export interface TenantBranding {
  logo: string;
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

export type TemplateType = 'default' | 'magazine' | 'minimal';

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
  loading: boolean;
  error: string | null;
}

