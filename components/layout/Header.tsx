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
          {/* CTA Buttons (left in RTL) */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="primary" size="sm">
              تسجيل الدخول
            </Button>
            <Button variant="surface" size="sm">
              إنشاء حساب
            </Button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-base font-semibold text-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-primary transition-colors ${
                  item.label === 'الرئيسية' ? 'text-gray-900 font-bold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logo (right in RTL) */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-44 h-12">
              <Image
                src={logo}
                alt={tenantName}
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

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
                <Button variant="surface" size="sm" className="w-full">
                  تسجيل الدخول
                </Button>
                <Button variant="primary" size="sm" className="w-full">
                  إنشاء حساب
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
