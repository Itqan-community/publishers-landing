import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

interface FooterProps {
  logo: string;
  tenantName: string;
  description: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  footerLinks?: Array<{
    label: string;
    items: Array<{ text: string; href: string }>;
  }>;
  copyright?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  tenantName,
  description,
  socialLinks,
  footerLinks,
  copyright = `© ${new Date().getFullYear()} ${tenantName}. جميع الحقوق محفوظة.`,
}) => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="relative w-48 h-12">
                <Image
                  src={logo}
                  alt={tenantName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {description}
            </p>
            
            {/* Social Media */}
            {socialLinks && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">
                  تابعنا على منصات التواصل الاجتماعي
                </p>
                <div className="flex gap-4">
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-200 text-gray-600"
                      aria-label="Twitter"
                    >
                      <FaTwitter size={18} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-200 text-gray-600"
                      aria-label="Instagram"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-100 hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-200 text-gray-600"
                      aria-label="TikTok"
                    >
                      <FaTiktok size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Link Columns */}
          {footerLinks?.map((linkGroup, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold mb-4 text-gray-900">
                {linkGroup.label}
              </h3>
              <ul className="space-y-3">
                {linkGroup.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-right">
            {copyright}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-primary transition-colors">
              شروط الخدمة
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-primary transition-colors">
              إعدادات الكوكيز
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
