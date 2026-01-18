/**
 * Asset Categories Section Component
 * 
 * Displays different types of content available (newspapers, readings, media)
 */

import Image from 'next/image';
import Link from 'next/link';
import { AssetCategoryContent } from '@/types/tenant.types';

interface AssetCategoriesSectionProps {
  categories: AssetCategoryContent[];
}

export function AssetCategoriesSection({ categories }: AssetCategoriesSectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a world of content across multiple formats and categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-sm font-semibold mb-1 text-secondary">
                    {category.itemCount.toLocaleString()} Items
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{category.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center text-primary font-semibold group-hover:text-secondary transition-colors">
                  Explore Collection
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

