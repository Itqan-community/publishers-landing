/**
 * Review / Arbitration Committee Section — Tahbeer (تحبير)
 * From Figma: "لجنة التحكيم والمراجعة" — intro + member cards + committee tasks
 */

import React from 'react';
import Image from 'next/image';

export interface ReviewMember {
  id: string;
  name: string;
  role: string;
  image?: string;
}

const defaultTitleClass = 'text-display-xs sm:text-display-sm md:text-display-md font-semibold text-[var(--color-foreground)] leading-tight section-title-gap';

export interface ReviewMembersSectionProps {
  id?: string;
  title?: string;
  introText: string;
  members: ReviewMember[];
  tasksTitle?: string;
  tasks: string[];
  /** Optional class for the section title (e.g. Tahbeer: 39px font-semibold). */
  titleClassName?: string;
}

const defaultTitle = 'لجنة التحكيم والمراجعة';
const defaultTasksTitle = 'مهام اللجنة:';

export const ReviewMembersSection: React.FC<ReviewMembersSectionProps> = ({
  id,
  title = defaultTitle,
  introText,
  members,
  tasksTitle = defaultTasksTitle,
  tasks,
  titleClassName,
}) => {
  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 bg-[var(--color-bg-neutral-50)] ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={titleClassName ? `${titleClassName} section-title-gap` : defaultTitleClass}>
          {title}
        </h2>
        <p className="text-md sm:text-lg text-[var(--color-text-paragraph)] leading-relaxed max-w-3xl mb-10">
          {introText}
        </p>

        {/* Member cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
            >
              {member.image ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 bg-[var(--color-bg-neutral-200)]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-4 text-2xl font-bold text-[var(--color-primary)]">
                  {member.name.charAt(0)}
                </div>
              )}
              <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{member.name}</h3>
              <p className="text-sm text-[var(--color-text-paragraph)] mt-1">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Committee tasks */}
        <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">{tasksTitle}</h3>
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md bg-[var(--color-button-black)] text-white px-4 py-3 text-sm sm:text-md"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs" aria-hidden>
                ✓
              </span>
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
