'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

interface CarouselProps {
  children: React.ReactNode;
  slidesToScroll?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  slidesToScroll = 1,
  loop = false,
  showArrows = true,
  showDots = false,
  className = '',
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop,
    slidesToScroll,
    align: 'start',
    direction: 'rtl',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4" style={{ direction: 'rtl' }}>
          {children}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            className="absolute end-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={scrollPrev}
            disabled={!emblaApi?.canScrollPrev()}
            aria-label="Previous slide"
          >
            <FiChevronRight size={22} className="text-gray-700" />
          </button>
          <button
            className="absolute start-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={scrollNext}
            disabled={!emblaApi?.canScrollNext()}
            aria-label="Next slide"
          >
            <FiChevronLeft size={22} className="text-gray-700" />
          </button>
        </>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
