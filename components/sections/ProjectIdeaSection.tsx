/**
 * Project Idea Section — Tahbeer (تحبير)
 * From Figma: "فكرة المشروع والمشاركين" — two columns: The Idea + Participants
 */

import React from 'react';

const defaultTitleClass = 'text-display-xs sm:text-display-sm md:text-display-md font-semibold text-[var(--color-foreground)] leading-tight';

export interface ProjectIdeaSectionProps {
  id?: string;
  /** Base path for links */
  basePath?: string;
  ideaTitle?: string;
  ideaParagraphs: string[];
  participantsTitle?: string;
  participants: Array<{ role: string; name: string }>;
  /** Optional class for section titles (e.g. Tahbeer: 39px font-semibold). */
  titleClassName?: string;
}

const defaultIdeaTitle = 'الفكرة';
const defaultParticipantsTitle = 'المشاركون في المشروع';

export const ProjectIdeaSection: React.FC<ProjectIdeaSectionProps> = ({
  id,
  basePath = '',
  ideaTitle = defaultIdeaTitle,
  ideaParagraphs,
  participantsTitle = defaultParticipantsTitle,
  participants,
  titleClassName,
}) => {
  const prefix = basePath || '';

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Column 1: الفكرة */}
          <div className="flex flex-col gap-4">
            <h2 className={`${titleClassName ?? defaultTitleClass} section-title-gap`}>
              {ideaTitle}
            </h2>
            <div className="flex flex-col gap-4 text-[var(--color-text-paragraph)] text-md sm:text-lg leading-relaxed">
              {ideaParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Column 2: المشاركون في المشروع */}
          <div className="flex flex-col gap-6">
            <h2 className={`${titleClassName ?? defaultTitleClass} section-title-gap`}>
              {participantsTitle}
            </h2>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {participants.map((item, idx) => (
                <li key={idx} className="flex flex-wrap gap-2 text-md sm:text-lg">
                  <span className="font-semibold text-[var(--color-foreground)]">{item.role}:</span>
                  <span className="text-[var(--color-text-paragraph)]">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
