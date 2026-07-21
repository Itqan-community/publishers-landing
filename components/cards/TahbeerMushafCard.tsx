import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { RecordedMushaf } from '@/types/tenant.types';

const TAHBEER_MUSHAF_ICON = '/icons/big-mushaf-tahbeer.svg';
/** Saudi / dark-green strokes (#193624). */
const GREEN_MUSHAF_ICON = '/icons/big-mushaf.svg';
/** Qiraat legacy 2nd-riwayah lime strokes (#9DCF68). */
const QIRAAT_LIME_MUSHAF_ICON = '/icons/big-mushaf-qiraat-lime.svg';
/** Qiraat archive — verdigris strokes (#1F5C57). */
const QIRAAT_VERDIGRIS_MUSHAF_ICON = '/icons/big-mushaf-qiraat-verdigris.svg';
/** Qiraat archive — deep teal/ink strokes (#0D3B38). */
const QIRAAT_INK_MUSHAF_ICON = '/icons/big-mushaf-qiraat-ink.svg';

export type MushafCardAppearance =
  | 'default'
  | 'green'
  | 'qiraat-mint'
  | 'qiraat-cream'
  | 'qiraat-paper'
  | 'qiraat-ink';

export interface TahbeerMushafCardProps {
  mushaf: RecordedMushaf;
  /**
   * `default` — Tahbeer beige + brown icon/CTA
   * `green` — mint band + dark-green icon (مصحف الجمع / legacy)
   * `qiraat-mint` — legacy 1st riwayah: mint band, dark icon, lime CTA
   * `qiraat-cream` — legacy 2nd riwayah: cream band, lime icon, lime CTA
   * `qiraat-paper` — archive 1st: paper band, verdigris icon/CTA
   * `qiraat-ink` — archive 2nd: sage band, ink icon, verdigris CTA
   */
  appearance?: MushafCardAppearance;
}

const APPEARANCE = {
  default: {
    border: 'border-[#ebe8e8]',
    band: 'bg-[#F9F5F3]',
    icon: TAHBEER_MUSHAF_ICON,
    cta: 'bg-[#B58A65] text-white hover:bg-[#9e7957] focus:ring-[#B58A65]',
  },
  green: {
    border: 'border-[#cfe8d8]',
    band: 'bg-[#EEF9F2]',
    icon: GREEN_MUSHAF_ICON,
    cta: 'bg-[#193624] text-white hover:bg-[#234d36] focus:ring-[#193624]',
  },
  'qiraat-mint': {
    border: 'border-[#ebe8e8]',
    band: 'bg-[#EEF9F2]',
    icon: GREEN_MUSHAF_ICON,
    cta: 'bg-[#9DCF68] text-[#004022] hover:bg-[#8fc45c] focus:ring-[#9DCF68]',
  },
  'qiraat-cream': {
    border: 'border-[#ebe8e8]',
    band: 'bg-[#F9F5F3]',
    icon: QIRAAT_LIME_MUSHAF_ICON,
    cta: 'bg-[#9DCF68] text-[#004022] hover:bg-[#8fc45c] focus:ring-[#9DCF68]',
  },
  'qiraat-paper': {
    border: 'border-[#D4CFC4]',
    band: 'bg-[#E6E2D8]',
    icon: QIRAAT_VERDIGRIS_MUSHAF_ICON,
    cta: 'bg-[#1F5C57] text-white hover:bg-[#174844] focus:ring-[#1F5C57]',
  },
  'qiraat-ink': {
    border: 'border-[#D4CFC4]',
    band: 'bg-[#DDE8E4]',
    icon: QIRAAT_INK_MUSHAF_ICON,
    cta: 'bg-[#0D3B38] text-white hover:bg-[#0a2e2c] focus:ring-[#0D3B38]',
  },
} as const;

const QIRAAT_APPEARANCES = new Set<MushafCardAppearance>([
  'qiraat-mint',
  'qiraat-cream',
  'qiraat-paper',
  'qiraat-ink',
]);

/**
 * Mushaf/recitation card (Tahbeer + Qiraat appearances).
 */
export const TahbeerMushafCard: React.FC<TahbeerMushafCardProps> = ({
  mushaf,
  appearance = 'default',
}) => {
  const { title, description, href } = mushaf;
  const styles = APPEARANCE[appearance];
  const isQiraat = QIRAAT_APPEARANCES.has(appearance);
  const radius = appearance === 'qiraat-paper' || appearance === 'qiraat-ink' ? 'rounded-[12px]' : 'rounded-[10px]';
  const bandRadius = appearance === 'qiraat-paper' || appearance === 'qiraat-ink' ? 'rounded-t-[12px]' : 'rounded-t-[10px]';

  return (
    <article
      className={`flex h-full w-full flex-col overflow-hidden border bg-white text-start ${radius} ${styles.border}`}
      dir="rtl"
    >
      <div className={`flex min-h-[200px] shrink-0 items-center justify-center py-8 sm:min-h-[226px] ${bandRadius} ${styles.band}`}>
        <div className="relative h-[140px] w-[136px] sm:h-[156px] sm:w-[156px] -scale-x-100" aria-hidden="true">
          <Image
            src={styles.icon}
            alt=""
            fill
            className="object-contain"
            sizes="156px"
            aria-hidden
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 bg-white px-3.5 py-4">
        <h3 className="text-[20px] font-semibold leading-[1.4] text-[var(--color-foreground,#1A1612)]">{title}</h3>
        {isQiraat && description ? (
          <p className="text-[13px] font-normal leading-[22.356px] text-[#6A6A6A] line-clamp-3">
            {description}
          </p>
        ) : null}
        <div className="mt-auto pt-2">
          <Link
            href={href}
            className={`inline-flex h-8 max-h-8 min-h-8 items-center justify-center rounded-[4px] px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.cta}`}
          >
            تصفح المصحف
          </Link>
        </div>
      </div>
    </article>
  );
};
