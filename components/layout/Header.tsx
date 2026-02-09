'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { FiMenu, FiX } from 'react-icons/fi';

interface HeaderProps {
  logo: string;
  tenantName: string;
  navItems: Array<{ label: string; href: string }>;
  /** Home/logo link (e.g. '/' or '/saudi-center') */
  homeHref?: string;
}

export const Header: React.FC<HeaderProps> = ({ logo, tenantName, navItems, homeHref = '/' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Determine if a nav item is active based on current route
  const isActive = (item: { label: string; href: string }) => {
    const [path, hash] = item.href.split('#');
    const normalizedPath = path || homeHref;

    if (hash) {
      // Anchor links are never shown as active (they're just section scrolls)
      return false;
    }

    // Home link: only active on exact match (not on sub-routes like /recitations)
    if (normalizedPath === homeHref) {
      return pathname === homeHref;
    }

    // Other regular links: exact match or starts with (for nested routes)
    return pathname === normalizedPath || pathname.startsWith(normalizedPath + '/');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { label: string; href: string }) => {
    const [path, hash] = item.href.split('#');

    if (hash) {
      const normalizedPath = path || homeHref;
      const isOnHomePage = pathname === normalizedPath || pathname === homeHref;

      if (isOnHomePage) {
        // Already on home - just scroll smoothly
        e.preventDefault();
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // On different page - navigate to home with hash
        e.preventDefault();
        router.push(item.href);
        // After navigation, scroll to the section
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const thresholdPx = 50;

    const onScroll = () => {
      setScrolled(window.scrollY > thresholdPx);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors bg-white/95 backdrop-blur border-b border-gray-200/70 ${scrolled ? '' : 'md:bg-transparent md:backdrop-blur-0 md:border-transparent'
        }`}
      dir="rtl"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px] gap-6">
          {/* Logo (start side in RTL) - Figma logo lockup */}
          <Link href={homeHref} className="flex-shrink-0 order-1 flex items-center">
            <div className="relative w-[180px] h-[32px] sm:w-[220px] sm:h-[40px] lg:w-[266px] lg:h-[44px]">
              <Image
                src="/logos/full-logo.svg"
                alt={tenantName}
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation (center) - Figma: gap 24px, 16px font, Medium weight, #6a6a6a inactive, black active */}
          <nav className="hidden md:flex items-center gap-6 text-[16px] font-medium order-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`transition-colors ${isActive(item)
                  ? 'text-black font-semibold' // Active: black, SemiBold
                  : 'text-[#6a6a6a] hover:text-black' // Inactive: gray #6a6a6a
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons (end side in RTL) - Figma: gap 16px between buttons, "تسجيل الدخول" (black) and "استمع الان" (green) */}
          <div className="hidden md:flex items-center gap-4 order-3">
            {/* <Button variant="secondary" size="sm">
              تسجيل الدخول
            </Button> */}
            <Link href="/recitations">
              <Button variant="primary" size="sm">
                استمع الان
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
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
                {/* <Button variant="secondary" size="sm" className="w-full">
                  تسجيل الدخول
                </Button> */}
                <Button variant="primary" size="sm" className="w-full">
                  استمع الان
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
