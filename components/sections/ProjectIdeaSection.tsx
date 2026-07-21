/**
 * Project Idea Section — Tahbeer (تحبير)
 * From Figma: "فكرة المشروع والمشاركين"
 * Layout: section header row + rounded card with two columns (الفكرة + المشاركون في المشروع)
 *
 * appearance `qiraat-archive`: paper panel + formal sanad card for participant(s).
 */

import React from 'react';

export interface Participant {
  role: string;
  name: string;
  description: string;
}

export type ProjectIdeaAppearance = 'default' | 'qiraat-archive';

export interface ProjectIdeaSectionProps {
  id?: string;
  /** Section-level title displayed above the card (e.g. "فكرة المشروع والمشاركين") */
  sectionTitle?: string;
  /** Section-level subtitle displayed next to sectionTitle (e.g. "تسجيل صوتي …") */
  sectionSubtitle?: string;
  /** Card column 1 heading */
  ideaTitle?: string;
  /** Paragraphs under "الفكرة" */
  ideaParagraphs: string[];
  /** Card column 2 heading */
  participantsTitle?: string;
  /** Participant entries with role, name, description */
  participants: Participant[];
  /** `qiraat-archive` = paper panel + sanad card. Default = Tahbeer layout. */
  appearance?: ProjectIdeaAppearance;
}

export const ProjectIdeaSection: React.FC<ProjectIdeaSectionProps> = ({
  id,
  sectionTitle = 'فكرة المشروع والمشاركين',
  sectionSubtitle = 'تسجيل صوتي للقراءات العشر بالروايات العشرين بكل طرق الأداء المنقولة عن الأئمة',
  ideaTitle = 'الفكرة',
  ideaParagraphs,
  participantsTitle = 'المشاركون في المشروع',
  participants,
  appearance = 'default',
}) => {
  const isArchive = appearance === 'qiraat-archive';

  if (isArchive) {
    return (
      <section
        id={id}
        className={`py-12 sm:py-16 md:py-20 bg-[var(--color-paper,#E6E2D8)] ${id ? 'scroll-mt-20' : ''}`}
        dir="rtl"
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row md:items-center sm:items-baseline gap-3 sm:gap-6 mb-8 sm:mb-10 md:mb-[30px]">
            <h2 className="text-[28px] sm:text-[33px] md:text-[39px] font-semibold text-[var(--color-foreground)] leading-[1.4] whitespace-nowrap shrink-0">
              {sectionTitle}
            </h2>
            <p className="text-[16px] sm:text-[17px] md:text-[19px] text-[var(--color-text-paragraph)] leading-[1.4] max-w-[448px] text-justify">
              {sectionSubtitle}
            </p>
          </div>
          <div
            className="h-px w-full max-w-[120px] bg-[var(--color-rule-gold,#A68B4B)] opacity-50 mb-8 -mt-4"
            aria-hidden="true"
          />

          <div className="bg-white rounded-[12px] overflow-hidden border border-[var(--color-rule-gold,#A68B4B)]/35 px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              <div className="flex flex-col">
                <h3 className="text-[24px] sm:text-[27px] md:text-[29px] font-semibold text-[var(--color-foreground)] leading-[1.4] mb-4 sm:mb-5 md:mb-6">
                  {ideaTitle}
                </h3>
                <div className="flex flex-col gap-4 text-[16px] sm:text-[17px] md:text-[19px] text-[var(--color-text-paragraph)] leading-[1.55]">
                  {ideaParagraphs.map((paragraph, idx) => (
                    <p key={idx} className="text-justify">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-[24px] sm:text-[27px] md:text-[29px] font-semibold text-[var(--color-foreground)] leading-[1.4] mb-4 sm:mb-5 md:mb-6">
                  {participantsTitle}
                </h3>
                <div className="flex flex-col gap-5">
                  {participants.map((participant, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1 border-s-2 border-[var(--color-primary)] ps-4 py-1"
                    >
                      <span className="text-[13px] sm:text-[14px] font-medium text-[var(--color-primary)]">
                        {participant.role}
                      </span>
                      <span className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[var(--color-foreground)] leading-[1.4]">
                        {participant.name}
                      </span>
                      <span className="text-[14px] sm:text-[15px] text-[var(--color-text-paragraph)] leading-[1.7] mt-0.5 text-justify block">
                        {participant.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`py-12 sm:py-16 md:py-20 bg-white ${id ? 'scroll-mt-20' : ''}`}
      dir="rtl"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header row ── */}
        <div className="flex flex-col sm:flex-row md:items-center sm:items-baseline gap-3 sm:gap-6 mb-8 sm:mb-10 md:mb-[30px]">
          <h2 className="text-[28px] sm:text-[33px] md:text-[39px] font-semibold text-[var(--color-foreground)] leading-[1.4] whitespace-nowrap shrink-0">
            {sectionTitle}
          </h2>
          <p className="text-[16px] sm:text-[17px] md:text-[19px] text-[var(--color-foreground)] leading-[1.4] max-w-[448px] text-justify">
            {sectionSubtitle}
          </p>
        </div>

        {/* ── Main card ── */}
        <div className="bg-[#f6f6f4] rounded-[16px] overflow-hidden px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-[59px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Column 1: الفكرة (right in RTL) */}
            <div className="flex flex-col">
              <h3 className="text-[24px] sm:text-[27px] md:text-[29px] font-semibold text-[var(--color-foreground)] leading-[1.4] mb-4 sm:mb-5 md:mb-6 text-justify">
                {ideaTitle}
              </h3>
              <div className="flex flex-col gap-4 text-[16px] sm:text-[17px] md:text-[19px] text-[var(--color-foreground)] leading-[1.4]">
                {ideaParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-justify">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Column 2: المشاركون في المشروع (left in RTL) */}
            <div className="flex flex-col">
              <h3 className="text-[24px] sm:text-[27px] md:text-[29px] font-semibold text-[var(--color-foreground)] leading-[1.4] mb-4 sm:mb-5 md:mb-6">
                {participantsTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8">
                {participants.map((participant, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[16px] sm:text-[17px] md:text-[19px] font-semibold text-[var(--color-foreground)] leading-[1.4]">
                      {participant.role}
                    </span>
                    <span className="text-[16px] sm:text-[17px] md:text-[19px] font-normal text-[var(--color-foreground)] leading-[1.4]">
                      {participant.name}
                    </span>
                    <span className="text-[13px] sm:text-[14px] md:text-[15px] text-[#6a6a6a] leading-[1.7] mt-0.5 text-justify block">
                      {participant.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
