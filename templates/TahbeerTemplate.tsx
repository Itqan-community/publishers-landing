/**
 * Tahbeer Template (تحبير)
 *
 * Home page template for Tahbeer — القراءات العشر.
 * Section order and content from Figma design.
 */

import { TenantConfig } from '@/types/tenant.types';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TenReadingsSection } from '@/components/sections/TenReadingsSection';
import type { TenReadingsItem } from '@/components/sections/TenReadingsSection';
import { ProjectIdeaSection } from '@/components/sections/ProjectIdeaSection';
import { ReviewMembersSection } from '@/components/sections/ReviewMembersSection';
import type { ReviewMember } from '@/components/sections/ReviewMembersSection';
import { FeatureItem } from '@/components/sections/AboutSection';

interface TahbeerTemplateProps {
  tenant: TenantConfig;
  basePath?: string;
}

/** Ten Qira'at + riwayats — from Figma "القراءات العشر ورواتها" */
const TEN_READINGS: TenReadingsItem[] = [
  { id: '1', number: 1, title: 'نافع المدني', riwayats: 'قالون، ورش', viewMushafHref: '/recitations' },
  { id: '2', number: 2, title: 'ابن كثير المكي', riwayats: 'البزي، قنبل', viewMushafHref: '/recitations' },
  { id: '3', number: 3, title: 'أبو عمرو البصري', riwayats: 'الدوري، السوسي', viewMushafHref: '/recitations' },
  { id: '4', number: 4, title: 'ابن عامر الشامي', riwayats: 'هشام، ابن ذكوان', viewMushafHref: '/recitations' },
  { id: '5', number: 5, title: 'عاصم الكوفي', riwayats: 'شعبة، حفص', viewMushafHref: '/recitations' },
  { id: '6', number: 6, title: 'حمزة الكوفي', riwayats: 'خلف، خلاد', viewMushafHref: '/recitations' },
  { id: '7', number: 7, title: 'الكسائي', riwayats: 'أبو الحارث، حفص الدوري', viewMushafHref: '/recitations' },
  { id: '8', number: 8, title: 'أبو جعفر المدني', riwayats: 'ابن وردان، ابن جماز', viewMushafHref: '/recitations' },
  { id: '9', number: 9, title: 'يعقوب الحضرمي', riwayats: 'رويس، روح', viewMushafHref: '/recitations' },
  { id: '10', number: 10, title: 'خلف العاشر', riwayats: 'إسحاق، إدريس', viewMushafHref: '/recitations' },
];

/** About project features — from Figma "عن المشروع" (4 cards) */
const TAHBEER_ABOUT_FEATURES: FeatureItem[] = [
  { id: '1', title: 'جودة عالية', description: 'التسجيلات بجودة صوتية استثنائية لأفضل تجربة استماع', iconSrc: '/icons/feature-award.svg' },
  { id: '2', title: 'جودة عالية', description: 'التسجيلات بجودة صوتية استثنائية لأفضل تجربة استماع', iconSrc: '/icons/feature-award.svg' },
  { id: '3', title: 'جودة عالية', description: 'التسجيلات بجودة صوتية استثنائية لأفضل تجربة استماع', iconSrc: '/icons/feature-award.svg' },
  { id: '4', title: 'جودة عالية', description: 'التسجيلات بجودة صوتية استثنائية لأفضل تجربة استماع', iconSrc: '/icons/feature-award.svg' },
];

/** Project idea paragraphs — from Figma "الفكرة" */
const TAHBEER_IDEA_PARAGRAPHS = [
  'إطلاق مشروع تحبير القراءات العشر من رؤية واضحة لإحياء التراث القرآني العظيم وذلك بتسجيل القرآن الكريم كاملاً بالقراءات العشر والروايات العشرين بصوت عذب وتقوى علامة تجمع بين جمال الأداء ودقة الأحكام.',
  'يهدف المشروع إلى توفير مرجع موثوق لقراءات العلم وتقديم علم القراءات ونشر هذا العلم الشريف بطريقة مبسطة ومتاحة للجميع.',
];

/** Participants — from Figma "المشاركون في المشروع" */
const TAHBEER_PARTICIPANTS = [
  { role: 'المدير العام', name: 'الشيخ صابر عبد الحكم' },
  { role: 'الإشراف العام', name: 'الشيخ خالد العمر' },
  { role: 'المنسق الإداري', name: 'الشيخ ريان الشريف' },
  { role: 'فريق التسجيل والإنتاج', name: 'فريق الإيمان' },
];

/** Review committee members — from Figma "لجنة التحكيم والمراجعة" */
const TAHBEER_REVIEW_MEMBERS: ReviewMember[] = [
  { id: '1', name: 'الشيخ أحمد العبيدي', role: 'رئيس اللجنة' },
  { id: '2', name: 'الشيخ سامي السلمي', role: 'عضو اللجنة' },
  { id: '3', name: 'الشيخ يوسف الدوسري', role: 'عضو اللجنة' },
];

/** Committee tasks — from Figma "مهام اللجنة" */
const TAHBEER_REVIEW_TASKS = [
  'مراجعة التسجيلات الصوتية والتحقق من صحة الأداء القرآني',
  'التحقق من تطبيق أحكام القراءات والروايات بدقة',
];

/** Section title style for Tahbeer: 39px, font-weight 600 */
const TAHBEER_SECTION_TITLE_CLASS = 'text-[39px] font-semibold text-[var(--color-foreground)] leading-tight';

export async function TahbeerTemplate({ tenant, basePath = '' }: TahbeerTemplateProps) {
  const prefix = basePath || '';

  return (
    <PageLayout tenant={tenant}>
      {/* Hero — uses tenant.content.hero; optional statsCard from Figma (2.5M) */}
      <div className="relative bg-bg-neutral-50 -mt-16 lg:-mt-header pt-7xl lg:pt-header">
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
          aria-hidden="true"
        />
        <HeroSection
          variant="legacy"
          content={tenant.content.hero}
          basePath={basePath}
          legacyLogoUrl={tenant.branding.logoFull ?? tenant.branding.logo}
          legacyShowCta={false}
          legacyShowAvatars={false}
          legacyShowSocial={true}
          legacyCheckmarkVariant="tahbeer"
          statsCard={{
            value: '2.5M',
            label: 'استماع على جميع',
            description: 'المنصات',
          }}
        />
      </div>

      {/* عن المشروع */}
      <AboutSection
        id="about"
        title="عن المشروع"
        features={TAHBEER_ABOUT_FEATURES}
        iconVariant="tahbeer"
        titleClassName={TAHBEER_SECTION_TITLE_CLASS}
      />

      {/* القراءات العشر ورواتها */}
      <TenReadingsSection
        id="readings"
        title="القراءات العشر ورواتها"
        items={TEN_READINGS}
        viewAllHref={`${prefix}/recitations`}
        basePath={prefix}
        titleClassName={TAHBEER_SECTION_TITLE_CLASS}
      />

      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-[var(--color-border)]" />
        </div>
      </div>

      {/* فكرة المشروع والمشاركين */}
      <ProjectIdeaSection
        id="project-idea"
        basePath={prefix}
        ideaTitle="الفكرة"
        ideaParagraphs={TAHBEER_IDEA_PARAGRAPHS}
        participantsTitle="المشاركون في المشروع"
        participants={TAHBEER_PARTICIPANTS}
        titleClassName={TAHBEER_SECTION_TITLE_CLASS}
      />

      {/* لجنة التحكيم والمراجعة */}
      <ReviewMembersSection
        id="review-members"
        title="لجنة التحكيم والمراجعة"
        introText="يضم المشروع فريق مراجعة دقيقة من لجنة علمية متخصصة في علم القراءات لضمان دقة الأداء وسلامة الأحكام القرآنية في جميع القراءات والروايات."
        members={TAHBEER_REVIEW_MEMBERS}
        tasksTitle="مهام اللجنة:"
        tasks={TAHBEER_REVIEW_TASKS}
        titleClassName={TAHBEER_SECTION_TITLE_CLASS}
      />
    </PageLayout>
  );
}
