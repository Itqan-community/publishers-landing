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
import { TahbeerSponsorsSection } from '@/components/sections/TahbeerSponsorsSection';
import type { TahbeerSponsorItem } from '@/components/sections/TahbeerSponsorsSection';
import { FeatureItem } from '@/components/sections/AboutSection';
import { getReviewMembers } from '@/lib/review-members';

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
  'انطلق مشروع تحبير القراءات العشر من رؤية واضحة لإحياء التراث القرآني العظيم، وذلك بتسجيل القرآن الكريم كاملاً بالقراءات العشر المتواترة والروايات العشرين، بصوت عذب وتلاوة متقنة تجمع بين جمال الأداء ودقة الأحكام.',
  'يهدف المشروع إلى توفير مرجع صوتي موثوق لطلاب العلم والمهتمين بعلم القراءات، ونشر هذا العلم الشريف بطريقة ميسرة ومتاحة للجميع.',
];

/** Participants — from Figma "المشاركون في المشروع" (2×2 grid with role, name, description) */
const TAHBEER_PARTICIPANTS = [
  { role: 'القارئ', name: 'الشيخ صابر عبد الحكم', description: 'قارئ وإمام متخصص في القراءات العشر' },
  { role: 'المشرف العام', name: 'الشيخ خالد البدر', description: 'الإشراف على تنفيذ المشروع' },
  { role: 'المنسق الإداري', name: 'الشيخ ريان الشريف', description: 'التنسيق الإداري والتنظيمي' },
  { role: 'فريق التسجيل والإنتاج', name: 'فريق الايمان', description: 'التسجيل والمونتاج والإنتاج' },
];

/** Fallback review committee members — used when API is unavailable */
const TAHBEER_REVIEW_MEMBERS_FALLBACK: ReviewMember[] = [
  { id: '1', name: 'الشيخ أحمد العبيدي', role: 'رئيس اللجنة', title: 'أستاذ القراءات بجامعة الاسلامية', image: '/images/tahbeer/review-member-1.jpg' },
  { id: '2', name: 'الشيخ سامي السلمي', role: 'عضو اللجنة', title: 'باحث متخصص في علم القراءات', image: '/images/tahbeer/review-member-2.jpg' },
  { id: '3', name: 'الشيخ يوسف الدوسري', role: 'عضو اللجنة', title: 'مقرئ ومتخصص في الروايات', image: '/images/tahbeer/review-member-3.jpg' },
];

/** Committee tasks — from Figma "مهام اللجنة" (2×2 grid) */
const TAHBEER_REVIEW_TASKS = [
  'مراجعة التسجيلات الصوتية والتحقق من صحة الأداء القرآني',
  'اعتماد التسجيلات النهائية قبل النشر',
  'التحقق من تطبيق أحكام القراءات والروايات بدقة',
  'تقديم الاستشارات العلمية للمشروع',
];

/** Sponsors — from Figma (logo start, name + description end) */
const TAHBEER_SPONSORS: TahbeerSponsorItem[] = [
  {
    id: '1',
    name: 'برنامج عبدالرحمن بن عبدالله الموسى لخدمة المجتمع',
    description: 'الداعم الرسمي وشريك النجاح للمشروع',
    logo: '/images/tahbeer/sponsor-mousa-program.svg',
  },
];

/** Section title style for Tahbeer: 39px, font-weight 600 */
const TAHBEER_SECTION_TITLE_CLASS = 'text-[39px] font-semibold text-[var(--color-foreground)] leading-tight';

export async function TahbeerTemplate({ tenant, basePath = '' }: TahbeerTemplateProps) {
  const prefix = basePath || '';

  // Fetch review members from API; fall back to hardcoded data if API is unavailable
  const apiReviewMembers = await getReviewMembers(tenant.id);
  const reviewMembers = apiReviewMembers.length > 0 ? apiReviewMembers : TAHBEER_REVIEW_MEMBERS_FALLBACK;

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
        sectionTitle="فكرة المشروع والمشاركين"
        sectionSubtitle="تسجيل صوتي للقراءات العشر بالروايات العشرين بكل طرق الأداء المنقولة عن الأئمة"
        ideaTitle="الفكرة"
        ideaParagraphs={TAHBEER_IDEA_PARAGRAPHS}
        participantsTitle="المشاركون في المشروع"
        participants={TAHBEER_PARTICIPANTS}
      />

      {/* لجنة التحكيم والمراجعة */}
      <ReviewMembersSection
        id="review-members"
        sectionTitle="لجنة التحكيم والمراجعة"
        sectionSubtitle="يخضع المشروع لمراجعة دقيقة من لجنة علمية متخصصة في علم القراءات، لضمان دقة الأداء وصحة الأحكام القرآنية في جميع القراءات والروايات."
        members={reviewMembers}
        tasksTitle="مهام اللجنة:"
        tasks={TAHBEER_REVIEW_TASKS}
      />

      {/* الرعاة — above footer */}
      <TahbeerSponsorsSection id="sponsors" sponsors={TAHBEER_SPONSORS} />
    </PageLayout>
  );
}
