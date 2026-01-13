import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
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
  const navItems = [
    { label: 'الرئيسية', href: `/${tenant.id}` },
    { label: 'عن المركز', href: `/${tenant.id}/about` },
    { label: 'المصاحف المسجلة', href: `/${tenant.id}/mushafs` },
    { label: 'القراء', href: `/${tenant.id}/reciters` },
    { label: 'التلاوات', href: `/${tenant.id}/recitations` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <Header
          logo={tenant.branding.logo}
          tenantName={tenant.name}
          navItems={navItems}
        />
      )}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && (
        <Footer
          logo={tenant.branding.logo}
          tenantName={tenant.name}
          description={tenant.content.footer.description}
          socialLinks={{
            twitter: tenant.content.footer.social?.find(s => s.platform.toLowerCase() === 'twitter')?.url,
            instagram: tenant.content.footer.social?.find(s => s.platform.toLowerCase() === 'instagram')?.url,
            tiktok: tenant.content.footer.social?.find(s => s.platform.toLowerCase() === 'tiktok')?.url,
          }}
          footerLinks={tenant.content.footer.links}
          copyright={tenant.content.footer.copyright}
        />
      )}
    </div>
  );
};
