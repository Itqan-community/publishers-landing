/**
 * Qiraat Template (موقع قراءات القرآن)
 *
 * Same section order / UX as Tahbeer; green branding + مفتاح السلطني content.
 */

import { TenantConfig } from '@/types/tenant.types';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TenReadingsSection } from '@/components/sections/TenReadingsSection';
import type { TenReadingsItem } from '@/components/sections/TenReadingsSection';
import { ProjectIdeaSection } from '@/components/sections/ProjectIdeaSection';
import { FeatureItem } from '@/components/sections/AboutSection';
import { getQiraahs } from '@/lib/qiraahs';
import { trimRiwayahName } from '@/lib/tahbeer-riwayah';
import { ALL_TEN_QIRAAHS } from '@/lib/ten-qiraahs';

interface QiraatTemplateProps {
  tenant: TenantConfig;
  basePath?: string;
}

const QIRAAT_ABOUT_FEATURES: FeatureItem[] = [
  {
    id: '1',
    title: '١٠ قراءات',
    description: 'القراءات العشر المتواترة عن الأئمة العشرة',
    iconSrc: '/icons/feature-award.svg',
  },
  {
    id: '2',
    title: 'جودة عالية',
    description: 'تسجيلات بجودة صوتية استثنائية لأفضل تجربة استماع',
    iconSrc: '/icons/feature-award.svg',
  },
  {
    id: '3',
    title: 'الروايات المتواترة',
    description: 'روايات متواترة عن كل إمام من الأئمة العشرة',
    iconSrc: '/icons/feature-award.svg',
  },
  {
    id: '4',
    title: 'القراءات الكبرى والصغرى',
    description: 'أول من سجّل القراءات العشر الكبرى والصغرى في العالم الإسلامي',
    iconSrc: '/icons/feature-award.svg',
  },
];

const QIRAAT_IDEA_PARAGRAPHS = [
  'انطلق موقع قراءات القرآن من رؤية لإتاحة مرجع صوتي موثوق للقراءات العشر، وذلك بتسجيلات الشيخ الدكتور مفتاح السلطني الذي يُعدّ من أوائل من سجّلوا القراءات العشر الكبرى والصغرى في العالم الإسلامي.',
  'يهدف الموقع إلى خدمة طلاب العلم والمهتمين بعلم القراءات، ونشر هذا العلم الشريف بطريقة ميسرة ومتاحة للجميع.',
];

const QIRAAT_PARTICIPANTS = [
  {
    role: 'القارئ',
    name: 'الشيخ الدكتور مفتاح السلطني',
    description: 'مقرئ بالقراءات العشر الكبرى والصغرى',
  },
];

const SECTION_TITLE_CLASS = 'text-[39px] font-semibold text-[var(--color-foreground)] leading-tight';

export async function QiraatTemplate({ tenant, basePath = '' }: QiraatTemplateProps) {
  const prefix = basePath || '';

  const qiraahs = await getQiraahs(tenant.id, 'QiraatTemplate (home)');

  const matchedApiIds = new Set<number>();

  const findApiMatch = (canonical: (typeof ALL_TEN_QIRAAHS)[number]) => {
    const bySlug = qiraahs.find((q) => q.slug === canonical.slug && !matchedApiIds.has(q.id));
    if (bySlug) return bySlug;
    return (
      qiraahs.find((q) => q.name.includes(canonical.name) && !matchedApiIds.has(q.id)) ??
      qiraahs.find((q) => canonical.name.includes(q.name) && !matchedApiIds.has(q.id))
    );
  };

  const tenReadingsItems: TenReadingsItem[] = ALL_TEN_QIRAAHS.map((canonical, index) => {
    const apiMatch = findApiMatch(canonical);
    if (apiMatch) {
      matchedApiIds.add(apiMatch.id);
      const riwayats =
        apiMatch.riwayahs?.map((r) => trimRiwayahName(r.name)).join('، ') ?? canonical.riwayats;
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

  return (
    <PageLayout tenant={tenant}>
      <div className="hero-section-surface relative bg-bg-neutral-50 -mt-16 lg:-mt-header pt-7xl lg:pt-header">
        <div className="hero-bg-pattern" aria-hidden="true" />
        <HeroSection
          variant="legacy"
          content={tenant.content.hero}
          basePath={basePath}
          socialLinks={tenant.content.footer?.social}
          legacyLogoUrl={tenant.branding.heroBrandImage}
          legacyShowCta={false}
          legacyShowAvatars={false}
          legacyShowSocial={true}
          legacyCheckmarkVariant="tahbeer"
          legacyBadgeItems={[
            'بصوت الشيخ مفتاح السلطني',
            'تلاوات متنوعة بمختلف الروايات',
          ]}
          statsCard={{
            value: 'كافة',
            label: 'القراءات',
            description: 'بكل طرق الرواية',
            descriptionClassName:
              'text-[10px] sm:text-[13px] lg:text-[14px] font-medium text-center leading-[1.5]',
          }}
        />
      </div>

      <AboutSection
        id="about"
        title="عن المشروع"
        features={QIRAAT_ABOUT_FEATURES}
        iconVariant="tahbeer"
        titleClassName={SECTION_TITLE_CLASS}
      />

      <TenReadingsSection
        id="readings"
        title="القراءات العشر ورواتها"
        items={tenReadingsItems}
        basePath={prefix}
        titleClassName={SECTION_TITLE_CLASS}
      />

      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-[var(--color-border)]" />
        </div>
      </div>

      <ProjectIdeaSection
        id="project-idea"
        sectionTitle="فكرة المشروع والمشاركون"
        sectionSubtitle="تجميع القرآن الكريم صوتيا بالقراءات العشر المتواترة من طرق الشاطبية والدرة المضيةو الطيبة"
        ideaTitle="الفكرة"
        ideaParagraphs={QIRAAT_IDEA_PARAGRAPHS}
        participantsTitle="المشاركون في المشروع"
        participants={QIRAAT_PARTICIPANTS}
      />
    </PageLayout>
  );
}
