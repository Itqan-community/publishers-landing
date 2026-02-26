'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { GovernmentBanner } from './GovernmentBanner';
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

  const navItems =
    tenant.template === 'tahbeer'
      ? [
          { label: 'الرئيسية', href: prefix || '/' },
          { label: 'القراءات العشر', href: `${prefix || '/'}#readings` },
          { label: 'فكرة المشروع', href: `${prefix || ''}#project-idea` },
          { label: 'لجنة المراجعة', href: `${prefix || ''}#review-members` },
        ]
      : [
          { label: 'الرئيسية', href: prefix ? prefix : '/' },
          { label: 'المصاحف المرتلة', href: `${prefix}/recitations` },
          { label: 'الأحاديث النبوية', href: `${prefix}/hadiths` },
        ];

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <>
          {tenant.features.governmentBanner && <GovernmentBanner />}
          <Header
            logo={tenant.branding.logo}
            logoFull={tenant.branding.logoFull ?? tenant.branding.logo}
            tenantName={tenant.name}
            navItems={navItems}
            homeHref={prefix || '/'}
            variant={tenant.template === 'tahbeer' ? 'legacy' : 'default'}
            template={tenant.template}
          />
        </>
      )}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer tenant={tenant} basePath={basePath} />}
    </div>
  );
};
