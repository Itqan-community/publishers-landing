'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { FiMenu, FiX } from 'react-icons/fi';

interface HeaderProps {
  logo: string;
  tenantName: string;
  navItems: Array<{ label: string; href: string }>;
}

export const Header: React.FC<HeaderProps> = ({ logo, tenantName, navItems }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200/70" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px] gap-6">
          {/* Logo (start side in RTL) - Figma: logo with icon and 2 lines of text */}
          <Link href="/" className="flex-shrink-0 order-1 flex items-center gap-3">
            {/* Logo icon */}
            <div className="relative w-[77px] h-[44px]">
              <Image
                src="/logos/center-logo-full.png"
                alt={tenantName}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {/* Two lines of text */}
            <div className="flex flex-col text-right">
              <div className="text-[18px] font-semibold text-black leading-tight">
                المركز السعودي
              </div>
              <div className="text-[16px] font-medium text-black leading-tight">
                للتلاوات القرآنية والأحاديث النبوية
              </div>
            </div>
          </Link>

          {/* Navigation (center) - Figma: gap 24px, 16px font, Medium weight, #6a6a6a inactive, black active */}
          <nav className="hidden md:flex items-center gap-6 text-[16px] font-medium order-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  item.label === 'الرئيسية'
                    ? 'text-black font-semibold' // Active: black, SemiBold
                    : 'text-[#6a6a6a] hover:text-primary' // Inactive: gray #6a6a6a
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons (end side in RTL) - Figma: gap 16px between buttons, "تسجيل الدخول" (black) and "استمع الان" (green) */}
          <div className="hidden md:flex items-center gap-4 order-3">
            <Button variant="secondary" size="sm">
              تسجيل الدخول
            </Button>
            <Button variant="primary" size="sm">
              استمع الان
            </Button>
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
                  className="text-gray-800 hover:text-primary font-semibold transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                <Button variant="secondary" size="sm" className="w-full">
                  تسجيل الدخول
                </Button>
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
