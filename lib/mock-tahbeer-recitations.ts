/**
 * Mock recitations listing data for Tahbeer when BE is temporarily down.
 * Use only for Tahbeer tenant; remove or bypass when API is back.
 */

import type { RecordedMushaf } from '@/types/tenant.types';
import type { RiwayahOption } from '@/lib/listing-riwayah';

const OUTLINE_PALETTE = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#db2777'];

const MOCK_MUSHAFS: Omit<RecordedMushaf, 'href'>[] = [
  {
    id: '1',
    title: 'مصحف برواية حفص عن عاصم',
    description: 'المصحف المرتل للشيخ صابر عبد الحكم',
    riwayaLabel: 'رواية حفص',
    reciter: { id: '1', name: 'الشيخ صابر عبد الحكم', avatarImage: '' },
    visuals: { topBackgroundColor: '#EEF9F2', outlineColor: OUTLINE_PALETTE[0] },
    badges: [{ id: 'r1', label: 'رواية حفص', icon: 'book', tone: 'green' }],
    year: undefined,
  },
  {
    id: '2',
    title: 'مصحف برواية ورش عن نافع',
    description: 'المصحف المرتل للشيخ صابر عبد الحكم',
    riwayaLabel: 'رواية ورش',
    reciter: { id: '1', name: 'الشيخ صابر عبد الحكم', avatarImage: '' },
    visuals: { topBackgroundColor: '#EEF9F2', outlineColor: OUTLINE_PALETTE[1] },
    badges: [{ id: 'r2', label: 'رواية ورش', icon: 'book', tone: 'green' }],
    year: undefined,
  },
  {
    id: '3',
    title: 'مصحف برواية قالون عن نافع',
    description: 'المصحف المرتل للشيخ صابر عبد الحكم',
    riwayaLabel: 'رواية قالون',
    reciter: { id: '1', name: 'الشيخ صابر عبد الحكم', avatarImage: '' },
    visuals: { topBackgroundColor: '#EEF9F2', outlineColor: OUTLINE_PALETTE[2] },
    badges: [{ id: 'r3', label: 'رواية قالون', icon: 'book', tone: 'green' }],
    year: undefined,
  },
  {
    id: '4',
    title: 'مصحف برواية الدوري عن أبي عمرو',
    description: 'المصحف المرتل للشيخ صابر عبد الحكم',
    riwayaLabel: 'رواية الدوري',
    reciter: { id: '1', name: 'الشيخ صابر عبد الحكم', avatarImage: '' },
    visuals: { topBackgroundColor: '#EEF9F2', outlineColor: OUTLINE_PALETTE[3] },
    badges: [{ id: 'r4', label: 'رواية الدوري', icon: 'book', tone: 'green' }],
    year: undefined,
  },
  {
    id: '5',
    title: 'مصحف برواية السوسي عن أبي عمرو',
    description: 'المصحف المرتل للشيخ صابر عبد الحكم',
    riwayaLabel: 'رواية السوسي',
    reciter: { id: '1', name: 'الشيخ صابر عبد الحكم', avatarImage: '' },
    visuals: { topBackgroundColor: '#EEF9F2', outlineColor: OUTLINE_PALETTE[4] },
    badges: [{ id: 'r5', label: 'رواية السوسي', icon: 'book', tone: 'green' }],
    year: undefined,
  },
  {
    id: '6',
    title: 'مصحف برواية شعبة عن عاصم',
    description: 'المصحف المرتل للشيخ صابر عبد الحكم',
    riwayaLabel: 'رواية شعبة',
    reciter: { id: '1', name: 'الشيخ صابر عبد الحكم', avatarImage: '' },
    visuals: { topBackgroundColor: '#EEF9F2', outlineColor: OUTLINE_PALETTE[0] },
    badges: [{ id: 'r6', label: 'رواية شعبة', icon: 'book', tone: 'green' }],
    year: undefined,
  },
];

const MOCK_RIWAYAH_OPTIONS: RiwayahOption[] = [
  { id: 1, label: 'رواية حفص' },
  { id: 2, label: 'رواية ورش' },
  { id: 3, label: 'رواية قالون' },
  { id: 4, label: 'رواية الدوري' },
  { id: 5, label: 'رواية السوسي' },
  { id: 6, label: 'رواية شعبة' },
];

/**
 * Mock recorded mushafs for Tahbeer (القراءات العشر theme).
 * @param basePath '' on custom domain, '/tahbeer' on path-based.
 */
export function getMockRecordedMushafsForTahbeer(basePath: string): RecordedMushaf[] {
  const prefix = basePath ? basePath.replace(/\/$/, '') : '';
  const recitationsPrefix = prefix ? `${prefix}/recitations` : 'recitations';
  return MOCK_MUSHAFS.map((m) => ({
    ...m,
    href: `${recitationsPrefix}/${m.id}`,
  }));
}

/**
 * Mock riwayah filter options for Tahbeer.
 */
export function getMockRiwayahsForTahbeer(): RiwayahOption[] {
  return [...MOCK_RIWAYAH_OPTIONS];
}
