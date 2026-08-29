/**
 * Theme Utilities
 * 
 * Functions to generate and apply CSS variables for runtime theming
 */

import { TenantBranding } from '@/types/tenant.types';
import { isTenQiraahsTemplate } from '@/lib/ten-qiraahs-template';

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Lighten a color by percentage
 */
function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const increase = (val: number) => Math.min(255, Math.floor(val + (255 - val) * (percent / 100)));

  const r = increase(rgb.r).toString(16).padStart(2, '0');
  const g = increase(rgb.g).toString(16).padStart(2, '0');
  const b = increase(rgb.b).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

/**
 * Darken a color by percentage
 */
function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const decrease = (val: number) => Math.max(0, Math.floor(val * (1 - percent / 100)));

  const r = decrease(rgb.r).toString(16).padStart(2, '0');
  const g = decrease(rgb.g).toString(16).padStart(2, '0');
  const b = decrease(rgb.b).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

/**
 * Generate CSS custom properties object from tenant branding (and optional template for layout vars)
 */
const DEFAULT_HERO_BG_PATTERN = '/images/hero-bg.svg';

export function generateThemeVariables(
  branding: TenantBranding,
  template?: string
): Record<string, string> {
  const { primaryColor, secondaryColor, accentColor, heroBackgroundPattern } = branding;
  const patternPath = heroBackgroundPattern || DEFAULT_HERO_BG_PATTERN;
  const vars: Record<string, string> = {
    '--color-primary': primaryColor,
    '--color-primary-dark': darkenColor(primaryColor, 20),
    '--color-primary-light': lightenColor(primaryColor, 20),
    '--color-secondary': secondaryColor,
    '--color-secondary-dark': darkenColor(secondaryColor, 20),
    '--color-secondary-light': lightenColor(secondaryColor, 20),
    '--color-accent': accentColor || secondaryColor,
    '--color-background': '#FFFFFF',
    '--color-foreground': '#1a1a1a',
    '--hero-bg-pattern': `url('${patternPath}')`,
  };
  if (isTenQiraahsTemplate(template)) {
    vars['--section-title-to-content-gap'] = '30px';
  }
  if (template === 'saudi-center') {
    /* Official logo gold (#CFA741) + green secondary — warm ivory surfaces */
    vars['--color-primary-light'] = '#D8B867';
    vars['--color-primary-dark'] = '#A58534';
    /* Same logo gold for filled CTAs (match nav / brand, not a second gold) */
    vars['--color-primary-solid'] = '#CFA741';
    vars['--color-background'] = '#FAF8F3';
    vars['--color-foreground'] = '#193624';
    vars['--color-text-default'] = '#193624';
    vars['--color-text-display'] = '#193624';
    vars['--color-text-paragraph'] = '#3D4A40';
    vars['--color-text-secondary'] = '#6B7A72';
    vars['--color-border'] = '#E5DCCE';
    vars['--color-border-secondary'] = '#E5DCCE';
    vars['--color-bg-neutral-50'] = '#FAF8F3';
    vars['--color-bg-neutral-100'] = '#F3EEE4';
    vars['--color-bg-neutral-200'] = '#E5DCCE';
    vars['--color-bg-card'] = '#FFFFFF';
    vars['--color-button-black'] = accentColor || '#1A2E22';
    /* Darker gold for icons (derived from logo primary #CFA741) */
    vars['--hero-social-color'] = '#A58534';
    vars['--about-icon-color'] = '#A58534';
    vars['--about-icon-bg'] = 'color-mix(in srgb, #CFA741 18%, white)';
    vars['--mushaf-card-top-bg'] = '#FFF8E8';
    vars['--stat-number-color'] = primaryColor;
    vars['--footer-bg'] = '#1A1612';
  } else if (template === 'qiraat') {
    /* Living mushaf archive — ink / verdigris / paper / sealing-wax */
    vars['--font-primary'] = 'var(--font-kufam), "Kufam", sans-serif';
    vars['--color-foreground'] = '#1A1612';
    vars['--color-text-paragraph'] = '#4A4540';
    vars['--color-background'] = '#FFFFFF';
    vars['--color-paper'] = '#E6E2D8';
    vars['--color-rule-gold'] = '#A68B4B';
    vars['--hero-surface'] = '#E6E2D8';
    vars['--hero-stats-text'] = '#FFFFFF';
    vars['--hero-social-color'] = primaryColor;
    vars['--about-icon-bg'] = '#DDE8E4';
    vars['--about-icon-color'] = primaryColor;
    /* Coming-soon — muted ink / teal (not lime) */
    vars['--coming-soon-badge-bg'] = '#DDE8E4';
    vars['--coming-soon-badge-text'] = secondaryColor;
    vars['--coming-soon-muted'] = '#7A756E';
    vars['--coming-soon-title'] = '#5C574F';
    vars['--coming-soon-hover-border'] = primaryColor;
  } else if (isTenQiraahsTemplate(template)) {
    vars['--font-primary'] = 'var(--font-fustat), "Fustat", sans-serif';
  }
  return vars;
}

/**
 * Apply theme variables to document root
 * Used on client-side
 */
export function applyThemeVariables(branding: TenantBranding, template?: string): void {
  if (typeof document === 'undefined') return;

  const variables = generateThemeVariables(branding, template);
  const root = document.documentElement;

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Generate inline style object for SSR (pass template for ten-qiraahs vars e.g. section gap)
 */
export function getThemeStyles(branding: TenantBranding, template?: string): React.CSSProperties {
  const variables = generateThemeVariables(branding, template) as Record<string, string>;
  const style: Record<string, string> = { ...variables };
  if (template === 'qiraat') {
    style.fontFamily = 'var(--font-kufam), "Kufam", sans-serif';
  } else if (isTenQiraahsTemplate(template)) {
    style.fontFamily = 'var(--font-fustat), "Fustat", sans-serif';
  }
  return style as React.CSSProperties;
}

/**
 * Get font link for external fonts
 */
export function getFontLink(fontName: string): string {
  const fontMap: Record<string, string> = {
    inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    'open-sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
    lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
    montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
    fustat:
      'https://fonts.googleapis.com/css2?family=Fustat:wght@200;300;400;500;600;700;800&display=swap',
    kufam:
      'https://fonts.googleapis.com/css2?family=Kufam:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
  };

  return fontMap[fontName.toLowerCase()] || fontMap.inter;
}

