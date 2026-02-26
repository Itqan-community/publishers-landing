/**
 * Review Committee Section — Tahbeer (تحبير)
 * "لجنة المراجعة" — title, subtitle, and مهام اللجنة (tasks bar)
 */

'use client';

import React from 'react';
import { CheckmarkBadgeIcon } from '@/components/ui/Icons';

export interface ReviewMembersSectionProps {
  id?: string;
  /** Section-level title (e.g. "لجنة المراجعة") */
  sectionTitle?: string;
  /** Section-level subtitle */
  sectionSubtitle?: string;
  tasksTitle?: string;
  tasks: string[];
}

const defaultSectionTitle = 'لجنة المراجعة';
const defaultTasksTitle = 'مهام اللجنة:';

export const ReviewMembersSection: React.FC<ReviewMembersSectionProps> = ({
  id,
  sectionTitle = defaultSectionTitle,
  sectionSubtitle,
  tasksTitle = defaultTasksTitle,
  tasks,
}) => {
  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 bg-[var(--color-bg-neutral-50)] ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header — title + subtitle */}
        <div className="flex flex-col sm:flex-row md:items-center sm:items-baseline gap-3 sm:gap-6 mb-8 sm:mb-10 md:mb-[30px]">
          <h2 className="text-[28px] sm:text-[33px] md:text-[39px] font-semibold text-[var(--color-foreground)] leading-[1.4] whitespace-nowrap shrink-0">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-[16px] sm:text-[17px] md:text-[19px] text-[var(--color-foreground)] leading-[1.4] max-w-[515px]">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* مهام اللجنة — tasks bar (black rounded card) */}
        <div className="bg-black rounded-[16px] overflow-hidden px-6 sm:px-8 md:px-10 py-7 sm:py-8 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <h3 className="text-[24px] sm:text-[27px] md:text-[29px] font-semibold text-[#f3f3f3] leading-[1.4] whitespace-nowrap shrink-0 self-start">
              {tasksTitle}
            </h3>

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
