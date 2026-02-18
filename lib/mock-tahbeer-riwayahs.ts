/**
 * Mock riwayah/reading detail data for Tahbeer riwayah page.
 * Use only for Tahbeer tenant; replace with API when ready.
 */

import type { RecordedMushaf } from '@/types/tenant.types';

export interface TahbeerReading {
  id: string;
  title: string;
  description: string;
  imam: {
    name: string;
    title: string;
    bio: string;
  };
  riwayahs: Array<{
    id: string;
    title: string;
    reciterName: string;
    reciterBio: string;
    mushafs: RecordedMushaf[];
  }>;
}

const RECITER_PLACEHOLDER = {
  id: '1',
  name: 'قارئ المصحف',
  avatarImage: '',
};

function makeMushaf(
  id: string,
  title: string,
  description: string,
  riwayaLabel: string,
  badgeId: string,
  recitationsPrefix: string
): RecordedMushaf {
  return {
    id,
    title,
    description,
    riwayaLabel,
    reciter: RECITER_PLACEHOLDER,
    visuals: { topBackgroundColor: '#EEF9F2', outlineColor: '#A67851' },
    badges: [{ id: badgeId, label: riwayaLabel, icon: 'book', tone: 'green' }],
    year: undefined,
    href: `${recitationsPrefix}/${id}`,
  };
}

/** Mock reading 1: نافع المدني — قالون + ورش */
function buildReading1(recitationsPrefix: string): TahbeerReading {
  const qalunMushafs: RecordedMushaf[] = [
    makeMushaf(
      'q1-1',
      'قالون بالتوسط مع سكون ميم الجمع',
      'تسجيل كامل للقرآن الكريم برواية قالون عن نافع بالتوسط مع سكون ميم الجمع',
      'رواية قالون',
      'r3',
      recitationsPrefix
    ),
    makeMushaf(
      'q1-2',
      'قالون بالإشباع',
      'تسجيل كامل للقرآن الكريم برواية قالون عن نافع بالإشباع',
      'رواية قالون',
      'r3',
      recitationsPrefix
    ),
    makeMushaf(
      'q1-3',
      'قالون بالإبدال',
      'تسجيل كامل للقرآن الكريم برواية قالون عن نافع بالإبدال',
      'رواية قالون',
      'r3',
      recitationsPrefix
    ),
    makeMushaf(
      'q1-4',
      'قالون بالتقليل',
      'تسجيل كامل للقرآن الكريم برواية قالون عن نافع بالتقليل',
      'رواية قالون',
      'r3',
      recitationsPrefix
    ),
  ];

  const warshMushafs: RecordedMushaf[] = [
    makeMushaf(
      'w1-1',
      'ورش من طريق الأزرق',
      'تسجيل كامل للقرآن الكريم برواية ورش عن نافع من طريق الأزرق',
      'رواية ورش',
      'r2',
      recitationsPrefix
    ),
    makeMushaf(
      'w1-2',
      'ورش من طريق الأصبهاني',
      'تسجيل كامل للقرآن الكريم برواية ورش عن نافع من طريق الأصبهاني',
      'رواية ورش',
      'r2',
      recitationsPrefix
    ),
    makeMushaf(
      'w1-3',
      'ورش بالتوسط',
      'تسجيل كامل للقرآن الكريم برواية ورش عن نافع بالتوسط',
      'رواية ورش',
      'r2',
      recitationsPrefix
    ),
    makeMushaf(
      'w1-4',
      'ورش بالإشباع',
      'تسجيل كامل للقرآن الكريم برواية ورش عن نافع بالإشباع',
      'رواية ورش',
      'r2',
      recitationsPrefix
    ),
  ];

  return {
    id: '1',
    title: 'نافع المدني',
    description:
      'قراءة أهل المدينة للنورة، وتمتاز بالأصول القوية والتواتر العالي.',
    imam: {
      name: 'الإمام نافع بن عبد الرحمن',
      title: 'التعريف بالإمام',
      bio: 'هو أبو رويم نافع بن عبد الرحمن بن أبي نعيم الليثي المدني، أحد القراء السبعة والأعلام، انتهت إليه رئاسة الإقراء في المدينة المنورة. توفي سنة 169 هـ.',
    },
    riwayahs: [
      {
        id: 'qalun',
        title: 'رواية قالون',
        reciterName: 'عيسى بن مينا (قالون)',
        reciterBio:
          'هو عيسى بن مينا بن وردان، قارئ المدينة ونحويها، لقبه نافع بـ "قالون" لجودة قراءته (تعني بالرومية: جيد). توفي سنة 220 هـ.',
        mushafs: qalunMushafs,
      },
      {
        id: 'warsh',
        title: 'رواية ورش',
        reciterName: 'عثمان بن سعيد (ورش)',
        reciterBio:
          'هو أبو سعيد عثمان بن سعيد بن عبد الله المصري، لقبه نافع بـ "ورش" لشدة بياضه. رحل إلى المدينة ليقرأ على نافع وختم عليه عدة ختمات. توفي سنة 197 هـ.',
        mushafs: warshMushafs,
      },
    ],
  };
}

/** Placeholder readings 2–10 (minimal data; expand when needed) */
function buildPlaceholderReading(
  id: string,
  title: string,
  description: string,
  imamName: string,
  imamBio: string,
  recitationsPrefix: string
): TahbeerReading {
  const singleMushaf = makeMushaf(
    `r${id}-1`,
    `مصحف برواية من ${title}`,
    `تسجيل كامل للقرآن الكريم من ${title}`,
    title,
    `r${id}`,
    recitationsPrefix
  );
  const featuredMushaf = makeMushaf(
    `r${id}-f1`,
    `مصحف مرتبط من ${title}`,
    `تسجيل كامل مرتبط بالقراءة من ${title}.`,
    title,
    `r${id}`,
    recitationsPrefix
  );
  return {
    id,
    title,
    description,
    imam: {
      name: imamName,
      title: 'التعريف بالإمام',
      bio: imamBio,
    },
    riwayahs: [
      {
        id: `${id}-1`,
        title: `رواية من ${title}`,
        reciterName: `راوي من ${title}`,
        reciterBio: `معلومات الراوي لـ ${title}.`,
        mushafs: [
          singleMushaf,
          { ...singleMushaf, id: `${id}-1b`, href: `${recitationsPrefix}/${id}-1b` },
          { ...singleMushaf, id: `${id}-1c`, href: `${recitationsPrefix}/${id}-1c` },
          { ...singleMushaf, id: `${id}-1d`, href: `${recitationsPrefix}/${id}-1d` },
        ],
      },
      {
        id: `${id}-featured`,
        title: `رواية أخرى من ${title}`,
        reciterName: `راوي آخر من ${title}`,
        reciterBio: `معلومات الراوي الآخر لـ ${title} (قسم Featured).`,
        mushafs: [
          featuredMushaf,
          { ...featuredMushaf, id: `${id}-f2`, href: `${recitationsPrefix}/${id}-f2` },
          { ...featuredMushaf, id: `${id}-f3`, href: `${recitationsPrefix}/${id}-f3` },
          { ...featuredMushaf, id: `${id}-f4`, href: `${recitationsPrefix}/${id}-f4` },
        ],
      },
    ],
  };
}

const READING_BUILDERS: Record<string, (recitationsPrefix: string) => TahbeerReading> = {
  '1': buildReading1,
};

const PLACEHOLDER_READINGS: Array<{
  id: string;
  title: string;
  description: string;
  imamName: string;
  imamBio: string;
}> = [
  { id: '2', title: 'ابن كثير المكي', description: 'قراءة أهل مكة.', imamName: 'الإمام عبد الله بن كثير', imamBio: 'أحد القراء السبعة، إمام قراءة مكة. توفي سنة 120 هـ.' },
  { id: '3', title: 'أبو عمرو البصري', description: 'قراءة أهل البصرة.', imamName: 'الإمام زبان بن العلاء', imamBio: 'أحد القراء السبعة، إمام قراءة البصرة. توفي سنة 154 هـ.' },
  { id: '4', title: 'ابن عامر الشامي', description: 'قراءة أهل الشام.', imamName: 'الإمام عبد الله بن عامر', imamBio: 'أحد القراء السبعة، إمام قراءة الشام. توفي سنة 118 هـ.' },
  { id: '5', title: 'عاصم الكوفي', description: 'قراءة أهل الكوفة.', imamName: 'الإمام عاصم بن أبي النجود', imamBio: 'أحد القراء السبعة، إمام قراءة الكوفة. توفي سنة 127 هـ.' },
  { id: '6', title: 'حمزة الكوفي', description: 'قراءة حمزة الكوفي.', imamName: 'الإمام حمزة بن حبيب الزيات', imamBio: 'أحد القراء السبعة. توفي سنة 156 هـ.' },
  { id: '7', title: 'الكسائي', description: 'قراءة الكسائي.', imamName: 'الإمام علي بن حمزة الكسائي', imamBio: 'أحد القراء السبعة. توفي سنة 189 هـ.' },
  { id: '8', title: 'أبو جعفر المدني', description: 'قراءة أبي جعفر المدني.', imamName: 'الإمام يزيد بن القعقاع', imamBio: 'أحد القراء السبعة. توفي سنة 130 هـ.' },
  { id: '9', title: 'يعقوب الحضرمي', description: 'قراءة يعقوب الحضرمي.', imamName: 'الإمام يعقوب بن إسحاق الحضرمي', imamBio: 'أحد القراء السبعة. توفي سنة 205 هـ.' },
  { id: '10', title: 'خلف العاشر', description: 'قراءة خلف العاشر.', imamName: 'الإمام خلف بن هشام البزار', imamBio: 'أحد القراء العشرة. توفي سنة 229 هـ.' },
];

/**
 * Get mock Tahbeer reading by id.
 * @param id Reading id (e.g. "1" for نافع المدني)
 * @param basePath '' on custom domain, '/tahbeer' on path-based
 */
export function getMockTahbeerReading(
  id: string,
  basePath: string
): TahbeerReading | null {
  const prefix = basePath ? basePath.replace(/\/$/, '') : '';
  const recitationsPrefix = prefix ? `${prefix}/recitations` : 'recitations';

  const builder = READING_BUILDERS[id];
  if (builder) {
    return builder(recitationsPrefix);
  }

  const placeholder = PLACEHOLDER_READINGS.find((r) => r.id === id);
  if (placeholder) {
    return buildPlaceholderReading(
      placeholder.id,
      placeholder.title,
      placeholder.description,
      placeholder.imamName,
      placeholder.imamBio,
      recitationsPrefix
    );
  }

  return null;
}
