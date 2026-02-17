/**
 * Review / Arbitration Committee Section — Tahbeer (تحبير)
 * From Figma: "لجنة التحكيم والمراجعة"
 * Layout: header row (title + subtitle + nav arrows) → portrait cards in Carousel → black tasks bar (2×2 pills)
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { CheckmarkBadgeIcon } from '@/components/ui/Icons';

/* ── Fallback person icon (same as ReciterCard) ── */
const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Arrow icon (for prev/next navigation) ── */
const ArrowIcon = ({ className, direction = 'right' }: { className?: string; direction?: 'left' | 'right' }) => (
  <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
    <path
      d={direction === 'right'
        ? 'M6.75 3.75L12 9L6.75 14.25'
        : 'M11.25 3.75L6 9L11.25 14.25'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface ReviewMember {
  id: string;
  name: string;
  /** Committee role displayed in primary color (e.g. "رئيس اللجنة") */
  role: string;
  /** Specialty or academic title (e.g. "أستاذ القراءات بجامعة الاسلامية") */
  title?: string;
  /** Portrait image URL */
  image?: string;
}

export interface ReviewMembersSectionProps {
  id?: string;
  /** Section-level title above cards (e.g. "لجنة التحكيم والمراجعة") */
  sectionTitle?: string;
  /** Section-level subtitle next to title */
  sectionSubtitle?: string;
  members: ReviewMember[];
  tasksTitle?: string;
  tasks: string[];
}

const defaultSectionTitle = 'لجنة التحكيم والمراجعة';
const defaultTasksTitle = 'مهام اللجنة:';

/* ── Single member card (portrait-style, similar to ReciterCard) ── */
const MemberCard: React.FC<{ member: ReviewMember }> = ({ member }) => {
  const [imageError, setImageError] = useState(false);
  useEffect(() => { setImageError(false); }, [member.image]);
  const showImage = member.image && member.image.trim() && !imageError;

  return (
    <div className="relative w-full overflow-hidden rounded-[10px] bg-black">
      {/* Aspect ratio: ~384×516 from Figma → approx 3:4 */}
      <div className="relative w-full" style={{ paddingBottom: '134.375%' }}>
        {/* Image area */}
        {showImage ? (
          <Image
            key={member.image}
            src={member.image!}
            alt={`صورة ${member.name}`}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#e5e7eb]">
            <UserIcon className="h-24 w-24 text-[#6a6a6a]" />
          </div>
        )}

        {/* White info overlay at bottom */}
        <div className="absolute bottom-[13px] start-[13px] end-[13px] bg-white rounded-[10px] px-5 sm:px-6 py-4 sm:py-5">
          <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-black leading-[22.356px]">
            {member.name}
          </h3>
          {member.title && (
            <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#6a6a6a] leading-[22.356px] mt-1.5">
              {member.title}
            </p>
          )}
          <p className="text-[17px] sm:text-[18px] md:text-[20px] font-normal text-[var(--color-primary)] leading-[22.356px] mt-1.5">
            {member.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ReviewMembersSection: React.FC<ReviewMembersSectionProps> = ({
  id,
  sectionTitle = defaultSectionTitle,
  sectionSubtitle,
  members,
  tasksTitle = defaultTasksTitle,
  tasks,
}) => {
  /* ── Embla carousel (RTL, show 3 on desktop) ── */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: 'start',
    direction: 'rtl',
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  /* Keep a ref so the arrow buttons can trigger scrolls without re-rendering */
  const scrollPrevRef = useRef(scrollPrev);
  const scrollNextRef = useRef(scrollNext);
  useEffect(() => { scrollPrevRef.current = scrollPrev; }, [scrollPrev]);
  useEffect(() => { scrollNextRef.current = scrollNext; }, [scrollNext]);

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 bg-[var(--color-bg-neutral-50)] ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 mb-8 sm:mb-10 md:mb-[30px]">
          <h2 className="text-[28px] sm:text-[33px] md:text-[39px] font-semibold text-[var(--color-foreground)] leading-[1.4] whitespace-nowrap shrink-0">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-[16px] sm:text-[17px] md:text-[19px] text-[var(--color-foreground)] leading-[1.4] max-w-[515px]">
              {sectionSubtitle}
            </p>
          )}
          {/* Navigation arrows */}
          <div className="flex items-center gap-2 sm:ms-auto shrink-0">
            <button
              onClick={() => scrollPrevRef.current()}
              className="w-[48px] h-[48px] md:w-[55.7px] md:h-[55.7px] rounded-full border border-[#d1d1d1] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="السابق"
            >
              <ArrowIcon className="w-[17px] h-[17px] text-gray-700" direction="right" />
            </button>
            <button
              onClick={() => scrollNextRef.current()}
              className="w-[48px] h-[48px] md:w-[55.7px] md:h-[55.7px] rounded-full border border-[#d1d1d1] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="التالي"
            >
              <ArrowIcon className="w-[17px] h-[17px] text-gray-700" direction="left" />
            </button>
          </div>
        </div>

        {/* ── Member cards in Carousel ── */}
        {members.length > 0 && (
          <div className="mb-8 sm:mb-10">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 sm:gap-5 lg:gap-6" style={{ direction: 'rtl' }}>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-0.625rem)] lg:flex-[0_0_calc((100%-3rem)/3)]"
                  >
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tasks bar (black rounded card) ── */}
        <div className="bg-black rounded-[16px] overflow-hidden px-6 sm:px-8 md:px-10 py-7 sm:py-8 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Tasks title */}
            <h3 className="text-[24px] sm:text-[27px] md:text-[29px] font-semibold text-[#f3f3f3] leading-[1.4] whitespace-nowrap shrink-0 self-start">
              {tasksTitle}
            </h3>

            {/* Task pills — 2×2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-white rounded-[50px] px-5 sm:px-6 py-3.5 sm:py-4"
                >
                  <CheckmarkBadgeIcon variant="tahbeer" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-black leading-none">
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
