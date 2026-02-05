/**
 * Theme Utilities
 * 
 * Functions to generate and apply CSS variables for runtime theming
 */

import { TenantBranding } from '@/types/tenant.types';

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
 * Generate CSS custom properties object from tenant branding
 */
export function generateThemeVariables(branding: TenantBranding): Record<string, string> {
  const { primaryColor, secondaryColor, accentColor } = branding;
  // Font is global (IBM Plex Sans Arabic) — not overridden per tenant

  return {
    '--color-primary': primaryColor,
    '--color-primary-dark': darkenColor(primaryColor, 20),
    '--color-primary-light': lightenColor(primaryColor, 20),
    '--color-secondary': secondaryColor,
    '--color-secondary-dark': darkenColor(secondaryColor, 20),
    '--color-secondary-light': lightenColor(secondaryColor, 20),
    '--color-accent': accentColor || secondaryColor,
    '--color-background': '#FFFFFF',
    '--color-foreground': '#1a1a1a',
  };
}

/**
 * Apply theme variables to document root
 * Used on client-side
 */
export function applyThemeVariables(branding: TenantBranding): void {
  if (typeof document === 'undefined') return;

  const variables = generateThemeVariables(branding);
  const root = document.documentElement;

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Generate inline style object for SSR
 */
export function getThemeStyles(branding: TenantBranding): React.CSSProperties {
  const variables = generateThemeVariables(branding);
  return variables as React.CSSProperties;
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
  };

  return fontMap[fontName.toLowerCase()] || fontMap.inter;
}

