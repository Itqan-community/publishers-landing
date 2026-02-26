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
import { TahbeerSponsorsSection } from '@/components/sections/TahbeerSponsorsSection';
import type { TahbeerSponsorItem } from '@/components/sections/TahbeerSponsorsSection';
import { FeatureItem } from '@/components/sections/AboutSection';
import { getQiraahs } from '@/lib/qiraahs';

interface TahbeerTemplateProps {
  tenant: TenantConfig;
  basePath?: string;
}

/** About project features — from Figma "عن المشروع" (4 cards) https://www.figma.com/design/ZuC4sVdPQuvuGVGzPigBb1/Ta7beer?node-id=2391-13613 */
const TAHBEER_ABOUT_FEATURES: FeatureItem[] = [
  { id: '2', title: '١٠ قراءات', description: 'القراءات العشر المتواترة عن الأئمة العشرة', iconSrc: '/icons/feature-award.svg' },
  { id: '1', title: 'جودة عالية', description: 'تسجيلات بجودة صوتية استثنائية لأفضل تجربة استماع', iconSrc: '/icons/feature-award.svg' },
  { id: '3', title: '٢٠ رواية', description: 'روايتان متواترتان عن كل إمام من الأئمة العشرة', iconSrc: '/icons/feature-award.svg' },
  { id: '4', title: 'تسجيل صوتي بكل طرق الرواية', description: 'بصوت الشيخ صابر عبد الحكم، وبجودة عالية', iconSrc: '/icons/feature-award.svg' },
];

/** Project idea paragraphs — from Figma "الفكرة" */
const TAHBEER_IDEA_PARAGRAPHS = [
  'انطلق مشروع تحبير القراءات العشر من رؤية واضحة لإحياء التراث القرآني العظيم، وذلك بتسجيل القرآن الكريم كاملاً بالقراءات العشر المتواترة والروايات العشرين، بصوت عذب وتلاوة متقنة تجمع بين جمال الأداء ودقة الأحكام.',
  'يهدف المشروع إلى توفير مرجع صوتي موثوق لطلاب العلم والمهتمين بعلم القراءات، ونشر هذا العلم الشريف بطريقة ميسرة ومتاحة للجميع.',
];

/** Participants — from Figma "المشاركون في المشروع" (2×2 grid with role, name, description) */
const TAHBEER_PARTICIPANTS = [
  { role: 'القارئ', name: 'الشيخ صابر عبد الحكم', description: 'قارئ وإمام متخصص في القراءات العشر' },
  { role: 'المشرف العام', name: 'الدكتور وليد الفخراني', description: 'الإشراف على تنفيذ المشروع' },
  { role: 'رئيس لجنة المراجعة', name: 'الشيخ المقرئ عدنان العوضي', description: 'إدارة لجنة المراجعة ومتابعة جودة وضبط التسجيلات' },
];

/** Committee tasks — static "مهام اللجنة" (2×2 grid) */
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

/** If riwayah name includes "عن", keep only what's before it (e.g. "حفص عن عاصم" → "حفص") */
function trimRiwayahName(name: string): string {
  const idx = name.indexOf('عن');
  if (idx === -1) return name;
  return name.slice(0, idx).trim();
}

export async function TahbeerTemplate({ tenant, basePath = '' }: TahbeerTemplateProps) {
  const prefix = basePath || '';

  const qiraahs = await getQiraahs(tenant.id, 'TahbeerTemplate (home)');

  const tenReadingsItems: TenReadingsItem[] = qiraahs.map((q, index) => ({
    id: String(q.id),
    number: index + 1,
    title: q.name,
    riwayats: q.riwayahs?.map((r) => trimRiwayahName(r.name)).join('، ') ?? '',
    viewMushafHref: `/qiraahs/${q.slug}`,
  }));

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
            value: 'كافة',
            label: 'القراءات',
            description: 'بكل طرق الرواية',
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
        items={tenReadingsItems}
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
        sectionTitle="فكرة المشروع والمشاركون"
        sectionSubtitle="تسجيل صوتي للقراءات العشر بالروايات العشرين بكل طرق الأداء المنقولة عن الأئمة"
        ideaTitle="الفكرة"
        ideaParagraphs={TAHBEER_IDEA_PARAGRAPHS}
        participantsTitle="المشاركون في المشروع"
        participants={TAHBEER_PARTICIPANTS}
      />

      {/* لجنة المراجعة */}
      <ReviewMembersSection
        id="review-members"
        sectionTitle="لجنة المراجعة"
        sectionSubtitle="يخضع المشروع لمراجعة دقيقة من لجنة علمية متخصصة في علم القراءات، لضمان دقة الأداء وصحة الأحكام القرآنية في جميع القراءات والروايات."
        tasksTitle="مهام اللجنة:"
        tasks={TAHBEER_REVIEW_TASKS}
      />

      {/* الرعاة — above footer */}
      <TahbeerSponsorsSection id="sponsors" sponsors={TAHBEER_SPONSORS} />
    </PageLayout>
  );
}
