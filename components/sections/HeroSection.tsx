/**
 * Hero Section Component
 * 
 * Large banner section with title, description, image, and CTA
 */

import Image from 'next/image';
import Link from 'next/link';
import { HeroContent } from '@/types/tenant.types';

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const { title, description, image, ctaText, ctaLink } = content;

  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 text-balance max-w-3xl mx-auto">
            {description}
          </p>
          
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-block bg-secondary hover:bg-secondary-dark text-foreground font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}

