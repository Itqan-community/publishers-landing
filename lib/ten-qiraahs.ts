/**
 * Canonical list of the 10 Qiraahs (القراءات العشر المتواترة).
 * Used as a static fallback and canonical order mapping for Tahbeer and Qiraat templates.
 */

import type { QiraahApiItem } from '@/lib/qiraahs';
import type { TenReadingsItem } from '@/components/sections/TenReadingsSection';
import { trimRiwayahName } from '@/lib/tahbeer-riwayah';

export interface CanonicalQiraah {
  id: number;
  slug: string;
  slugs?: string[];
  name: string;
  keywords: string[];
  riwayats: string;
}

export const ALL_TEN_QIRAAHS: CanonicalQiraah[] = [
  {
    id: 1,
    slug: 'nafi-al-madani',
    slugs: ['lmm-nf-lmdny', 'nafi-al-madani'],
    name: 'نافع المدني',
    keywords: ['نافع'],
    riwayats: 'قالون، ورش',
  },
  {
    id: 2,
    slug: 'ibn-kathir-al-makki',
    slugs: ['lmm-bn-kthyr-lmky', 'ibn-kathir-al-makki'],
    name: 'ابن كثير المكي',
    keywords: ['كثير'],
    riwayats: 'البزي، قنبل',
  },
  {
    id: 3,
    slug: 'abu-amr-al-basri',
    slugs: ['lmm-bw-mrw-lbsry', 'abu-amr-al-basri'],
    name: 'أبو عمرو البصري',
    keywords: ['عمرو'],
    riwayats: 'الدوري، السوسي',
  },
  {
    id: 4,
    slug: 'ibn-amir-al-shami',
    slugs: ['lmm-bn-mr-lshmy', 'ibn-amir-al-shami'],
    name: 'ابن عامر الشامي',
    keywords: ['عامر'],
    riwayats: 'هشام، ابن ذكوان',
  },
  {
    id: 5,
    slug: 'asim-al-kufi',
    slugs: ['lmm-sm-lkwfy', 'asim-al-kufi'],
    name: 'عاصم الكوفي',
    keywords: ['عاصم'],
    riwayats: 'شعبة، حفص',
  },
  {
    id: 6,
    slug: 'hamza-al-kufi',
    slugs: ['lmm-hmz-lkwfy', 'hamza-al-kufi'],
    name: 'حمزة الكوفي',
    keywords: ['حمزة'],
    riwayats: 'خلف، خلاد',
  },
  {
    id: 7,
    slug: 'al-kisai',
    slugs: ['lmm-lksyy-lkwfy', 'al-kisai'],
    name: 'الكسائي',
    keywords: ['الكسائي', 'كسائي'],
    riwayats: 'أبو الحارث، الدوري',
  },
  {
    id: 8,
    slug: 'abu-jaafar-al-madani',
    slugs: ['lmm-bw-jfr-lmdny', 'abu-jaafar-al-madani'],
    name: 'أبو جعفر المدني',
    keywords: ['جعفر'],
    riwayats: 'ابن وردان، ابن جماز',
  },
  {
    id: 9,
    slug: 'yaqub-al-hadrami',
    slugs: ['lmm-yqwb-lhdrmy-lbsry', 'yaqub-al-hadrami'],
    name: 'يعقوب الحضرمي',
    keywords: ['يعقوب'],
    riwayats: 'رويس، روح',
  },
  {
    id: 10,
    slug: 'khalaf-al-ashir',
    slugs: ['lmm-khlf-bn-hshm-lshr-lkwfy', 'khalaf-al-ashir'],
    name: 'خلف العاشر',
    keywords: ['خلف'],
    riwayats: 'إسحاق، إدريس',
  },
];

/**
 * Builds the array of TenReadingsItem from API qiraahs, accurately matching them
 * against canonical 10 qiraahs and falling back to "coming soon" when not yet in API.
 */
export function buildTenReadingsItems(
  apiQiraahs: QiraahApiItem[],
): TenReadingsItem[] {
  const matchedApiIds = new Set<number>();

  const findApiMatch = (canonical: CanonicalQiraah): QiraahApiItem | undefined => {
    // 1. Match by slug or slug aliases
    let match = apiQiraahs.find(
      (q) =>
        !matchedApiIds.has(q.id) &&
        (q.slug === canonical.slug || (canonical.slugs && canonical.slugs.includes(q.slug)))
    );
    if (match) return match;

    // 2. Match by canonical ID (1..10)
    match = apiQiraahs.find((q) => !matchedApiIds.has(q.id) && q.id === canonical.id);
    if (match) return match;

    // 3. Match by identifying keywords (e.g. ['خلف'] for Khalaf al-Ashir, ['جعفر'] for Abu Ja'afar)
    match = apiQiraahs.find(
      (q) => !matchedApiIds.has(q.id) && canonical.keywords.some((kw) => q.name.includes(kw))
    );
    if (match) return match;

    // 4. Substring fallback
    return apiQiraahs.find(
      (q) =>
        !matchedApiIds.has(q.id) &&
        (q.name.includes(canonical.name) || canonical.name.includes(q.name))
    );
  };

  return ALL_TEN_QIRAAHS.map((canonical, index) => {
    const apiMatch = findApiMatch(canonical);
    if (apiMatch) {
      matchedApiIds.add(apiMatch.id);
      const riwayats =
        apiMatch.riwayahs && apiMatch.riwayahs.length > 0
          ? apiMatch.riwayahs.map((r) => trimRiwayahName(r.name)).join('، ')
          : canonical.riwayats;
      return {
        id: String(apiMatch.id),
        number: index + 1,
        title: apiMatch.name,
        riwayats,
        viewMushafHref: `/qiraahs/${apiMatch.slug}`,
      };
    }

    return {
      id: `canonical-${canonical.slug}`,
      number: index + 1,
      title: canonical.name,
      riwayats: canonical.riwayats,
      viewMushafHref: `/qiraahs/coming-soon`,
      comingSoon: true,
    };
  });
}
