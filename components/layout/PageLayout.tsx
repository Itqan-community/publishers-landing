'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useTenant } from '@/components/providers/TenantProvider';
import { TenantConfig } from '@/types/tenant.types';

interface PageLayoutProps {
  tenant: TenantConfig;
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  tenant,
  children,
  showHeader = true,
  showFooter = true,
}) => {
  const { basePath } = useTenant();
  const prefix = basePath || '';

  const navItems = [
    { label: 'الرئيسية', href: prefix ? prefix : '/' },
    { label: 'عن المركز', href: `${prefix}#about` },
    { label: 'المصاحف المسجلة', href: `${prefix}/recitations` },
    { label: 'القراء', href: `${prefix}#reciters` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <Header
          logo={tenant.branding.logo}
          tenantName={tenant.name}
          navItems={navItems}
          homeHref={prefix || '/'}
        />
      )}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer tenant={tenant} basePath={basePath} />}
    </div>
  );
};
