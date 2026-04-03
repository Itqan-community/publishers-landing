/**
 * Canonical list of the 10 Qiraahs (القراءات العشر المتواترة).
 * Used as a static fallback when the backend hasn't returned all 10 yet.
 */

export interface CanonicalQiraah {
  slug: string;
  name: string;
  riwayats: string;
}

export const ALL_TEN_QIRAAHS: CanonicalQiraah[] = [
  { slug: 'nafi-al-madani', name: 'نافع المدني', riwayats: 'قالون، ورش' },
  { slug: 'ibn-kathir-al-makki', name: 'ابن كثير المكي', riwayats: 'البزي، قنبل' },
  { slug: 'abu-amr-al-basri', name: 'أبو عمرو البصري', riwayats: 'الدوري، السوسي' },
  { slug: 'ibn-amir-al-shami', name: 'ابن عامر الشامي', riwayats: 'هشام، ابن ذكوان' },
  { slug: 'asim-al-kufi', name: 'عاصم الكوفي', riwayats: 'شعبة، حفص' },
  { slug: 'hamza-al-kufi', name: 'حمزة الكوفي', riwayats: 'خلف، خلاد' },
  { slug: 'al-kisai', name: 'الكسائي', riwayats: 'أبو الحارث، الدوري' },
  { slug: 'abu-jaafar-al-madani', name: 'أبو جعفر المدني', riwayats: 'ابن وردان، ابن جماز' },
  { slug: 'yaqub-al-hadrami', name: 'يعقوب الحضرمي', riwayats: 'رويس، روح' },
  { slug: 'khalaf-al-ashir', name: 'خلف العاشر', riwayats: 'إسحاق، إدريس' },
];
