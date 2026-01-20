import { cache } from 'react';
import type { RecordedMushaf } from '@/types/tenant.types';

/**
 * Server-side data accessor for Recorded Mushafs.
 *
 * Today: returns mocked data matching the Figma cards.
 * Later: replace the body with a real BE call (fetch/GraphQL/etc.) without touching UI.
 */
export const getRecordedMushafs = cache(async (tenantId: string): Promise<RecordedMushaf[]> => {
  // TODO(BE): Replace with real API call. Keep tenantId for multi-tenant scoping.

  return [
    {
      id: 'mushaf-1',
      title: 'مصحف الحرم المكي',
      description: 'استمع للقرآن الكريم بصوت الشيخ أحمد العبيدي',
      reciter: {
        id: 'reciter-1',
        name: 'الشيخ أحمد العبيدي',
        avatarImage: '/images/mushafs/mushaf-reciter-1.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [
        { id: 'b1', label: 'حفص', icon: 'book', tone: 'green' },
        { id: 'b2', label: 'جودة عالية', icon: 'sparkle', tone: 'gold' },
      ],
      href: `/${tenantId}/recitations/1`,
    },
    {
      id: 'mushaf-2',
      title: 'مصحف الحرم المدني',
      description: 'استمع للقرآن الكريم بصوت الشيخ سامي السلمي',
      reciter: {
        id: 'reciter-2',
        name: 'الشيخ سامي السلمي',
        avatarImage: '/images/mushafs/mushaf-reciter-2.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [{ id: 'b1', label: 'حفص', icon: 'book', tone: 'green' }],
      href: `/${tenantId}/recitations/2`,
    },
    {
      id: 'mushaf-3',
      title: 'مصحف برواية حفص',
      description: 'استمع للقرآن الكريم بصوت الشيخ يوسف الدوسري',
      reciter: {
        id: 'reciter-3',
        name: 'الشيخ يوسف الدوسري',
        avatarImage: '/images/mushafs/mushaf-reciter-3.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [{ id: 'b1', label: 'حفص', icon: 'book', tone: 'green' }],
      href: `/${tenantId}/recitations/3`,
    },
    {
      id: 'mushaf-4',
      title: 'مصحف برواية ورش',
      description: 'استمع للقرآن الكريم بصوت الشيخ ياسر الدوسري',
      reciter: {
        id: 'reciter-4',
        name: 'الشيخ ياسر الدوسري',
        avatarImage: '/images/mushafs/mushaf-reciter-4.png',
      },
      visuals: {
        topBackgroundColor: '#EEF9F2',
      },
      badges: [{ id: 'b1', label: 'ورش', icon: 'book', tone: 'green' }],
      href: `/${tenantId}/recitations/4`,
    },
  ];
});


