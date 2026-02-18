'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';

/* ─── "Listen now" icon (default/gov variant only) ─── */
const ListenNowIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path d="M17.7 21.3351C16.528 21.4998 14.9996 21.4998 12.95 21.4998H11.05C7.01949 21.4998 5.00424 21.4998 3.75212 20.2477C2.5 18.9955 2.5 16.9803 2.5 12.9498V11.0498C2.5 7.01927 2.5 5.00402 3.75212 3.7519C5.00424 2.49978 7.01949 2.49978 11.05 2.49978H12.95C16.9805 2.49978 18.9958 2.49978 20.2479 3.7519C21.5 5.00402 21.5 7.01927 21.5 11.0498V12.9498C21.5 14.158 21.5 15.1851 21.4663 16.0649C21.4392 16.7699 21.4257 17.1224 21.1587 17.2542C20.8917 17.3859 20.5931 17.1746 19.9958 16.752L18.65 15.7998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.9453 12.3948C14.7686 13.0215 13.9333 13.4644 12.2629 14.3502C10.648 15.2064 9.8406 15.6346 9.18992 15.4625C8.9209 15.3913 8.6758 15.2562 8.47812 15.07C8 14.6198 8 13.7465 8 12C8 10.2535 8 9.38018 8.47812 8.92995C8.6758 8.74381 8.9209 8.60868 9.18992 8.53753C9.8406 8.36544 10.648 8.79357 12.2629 9.64983C13.9333 10.5356 14.7686 10.9785 14.9453 11.6052C15.0182 11.8639 15.0182 12.1361 14.9453 12.3948Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

interface HeaderProps {
  logo: string;
  /** Full-width logo for header (falls back to logo if not set) */
  logoFull?: string;
  tenantName: string;
  navItems: Array<{ label: string; href: string }>;
  /** Home/logo link (e.g. '/' or '/saudi-center') */
  homeHref?: string;
  /**
   * - default: Gov-style (design system tokens: h-header, text-md, bg-primary, etc.).
   * - legacy: Old header look (explicit 72px, 16px, rounded-[4px], theme vars for colors).
   */
  variant?: 'default' | 'legacy';
  /** Template type — used to apply Saudi Center–specific logo/sizes (matches footer) without affecting Tahbeer */
  template?: string;
}

export const Header: React.FC<HeaderProps> = ({ logo, logoFull, tenantName, navItems, homeHref = '/', variant = 'default', template }) => {
  // Saudi Center: use same logo and sizes as footer (/logos/full-logo-dark-bg.svg)
  const isSaudiCenter = template === 'saudi-center' && variant === 'default';
  const logoSrc = isSaudiCenter ? '/logos/full-logo.svg' : (logoFull ?? logo);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const listenHref = homeHref === '/' ? '/recitations' : `${homeHref}/recitations`;

  useEffect(() => {
    const thresholdPx = 50;
    const onScroll = () => setScrolled(window.scrollY > thresholdPx);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Determine if a nav item is active based on current route
  const isActive = (item: { label: string; href: string }) => {
    const [path, hash] = item.href.split('#');
    const normalizedPath = path || homeHref;

    if (hash) {
      return false;
    }

    if (normalizedPath === homeHref) {
      return pathname === homeHref;
    }

    return pathname === normalizedPath || pathname.startsWith(normalizedPath + '/');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { label: string; href: string }) => {
    const [path, hash] = item.href.split('#');

    if (hash) {
      const normalizedPath = path || homeHref;
      const isOnHomePage = pathname === normalizedPath || pathname === homeHref;

      if (isOnHomePage) {
        e.preventDefault();
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        e.preventDefault();
        const fullPath = homeHref.endsWith('/') ? `${homeHref}#${hash}` : `${homeHref}/#${hash}`;
        router.push(fullPath);
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    setMobileMenuOpen(false);
  };

  /* ─── Legacy variant: Tahbeer — transparent at top, scroll effect, text nav, primary Button CTA ─── */
  if (variant === 'legacy') {
    return (
      <header
        className={`sticky top-0 z-50 transition-colors bg-white/95 backdrop-blur border-b border-gray-200/70 font-primary antialiased ${scrolled ? '' : 'md:bg-transparent md:backdrop-blur-0 md:border-transparent'}`}
        dir="rtl"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px] gap-6">
            {/* Logo — order-0 so it stays at start (right in RTL) */}
            <Link href={homeHref} className="flex-shrink-0 order-0 flex items-center">
              <div className="relative h-14 w-14">
                <Image
                  src={logoSrc}
                  alt={tenantName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Navigation (center) — 16px font, gray inactive, black active */}
            <nav className="hidden md:flex items-center gap-6 text-[16px] font-medium order-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`transition-colors ${isActive(item)
                    ? 'text-black font-semibold'
                    : 'text-[#6a6a6a] hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA (end side in RTL) — primary Button */}
            <div className="hidden md:flex items-center gap-4 order-3 invisible">
              <Link href={listenHref}>
                <Button variant="primary" size="sm">
                  استمع الان
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button — order-last so it stays at end (left in RTL) */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors order-last"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="text-gray-800 hover:text-primary font-semibold transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                  <Link href={listenHref} className="block">
                    <Button variant="primary" size="sm" className="w-full">
                      استمع الان
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    );
  }

  /* ─── Default variant: Gov-style (Saudi Center) — design system tokens ─── */
  return (
    <header
      className="sticky top-0 z-50 bg-white font-primary antialiased border-b border-[#ebe8e8]"
      dir="rtl"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-8">
        <div className="flex items-center justify-between h-header">

          {/* ── Right side: Logo + Nav Items ── */}
          <div className="flex items-center gap-8 flex-1 min-w-0">
            {/* Logo — Saudi Center: same as footer (h-[40px] w-[200px] sm:h-[44px] sm:w-[266px]) */}
            <Link href={homeHref} className="flex-shrink-0 flex items-center">
              <div className={`relative ${isSaudiCenter ? 'h-[40px] w-[200px] sm:h-[44px] sm:w-[266px]' : 'w-[180px] h-[32px] sm:w-[220px] sm:h-[40px] lg:w-[266px] lg:h-[44px]'}`}>
                <Image
                  src={logoSrc}
                  alt={tenantName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1 h-header">
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`group relative flex items-center justify-center h-header px-4 text-md rounded-xs transition-colors duration-200
                      ${active
                        ? 'bg-primary text-white font-semibold'
                        : 'text-foreground font-medium hover:bg-primary/10'
                      }`}
                  >
                    {item.label}
                    {/* Bottom indicator: visible on active and hover (theme-aware) */}
                    <span
                      className={`absolute bottom-0 start-2 end-2 h-[6px] rounded-full transition-colors duration-200
                        ${active
                          ? 'bg-secondary'
                          : 'bg-transparent group-hover:bg-primary/25'
                        }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── Left side: Action Buttons ── */}
          <div className="hidden md:flex items-center h-header">
            {/* استمع الان */}
            <Link
              href={listenHref}
              className="flex items-center justify-center gap-1 h-header px-4 text-md font-medium text-foreground hover:bg-primary/10 rounded-xs transition-colors duration-200"
            >
              <ListenNowIcon size={24} />
              <span>استمع الان</span>
            </Link>
          </div>

          {/* ── Mobile Menu Button ── */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-gray-100 rounded-xs transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#ebe8e8]">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`group relative flex items-center px-4 py-3 rounded-xs text-md transition-colors
                      ${active
                        ? 'bg-primary text-white font-semibold'
                        : 'text-foreground font-medium hover:bg-primary/10'
                      }`}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 start-2 end-2 h-[4px] rounded-full transition-colors duration-200
                        ${active
                          ? 'bg-secondary'
                          : 'bg-transparent group-hover:bg-primary/25'
                        }`}
                    />
                  </Link>
                );
              })}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-[#ebe8e8]">
                <Link href={listenHref} className="flex items-center justify-center gap-2 px-4 py-3 text-md font-medium text-foreground rounded-xs hover:bg-primary/10 transition-colors">
                  <ListenNowIcon size={20} />
                  استمع الان
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
