'use client';

/**
 * Theme Provider Component
 * 
 * This client component applies tenant branding as CSS variables
 * and ensures the theme is applied immediately on the client
 */

import { useEffect } from 'react';
import { TenantBranding } from '@/types/tenant.types';
import { applyThemeVariables } from '@/lib/theme';

interface ThemeProviderProps {
  branding: TenantBranding;
  template?: string;
  children: React.ReactNode;
}

export function ThemeProvider({ branding, template, children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme variables when branding changes (includes --font-primary for Tahbeer)
    applyThemeVariables(branding, template);
  }, [branding, template]);

  return <>{children}</>;
}

