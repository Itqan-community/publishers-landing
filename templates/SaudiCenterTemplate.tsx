/**
 * Saudi Center Template
 * 
 * Home page template for the Saudi Center for Quranic Recitations
 * Includes all sections from the Figma design
 */

import { TenantConfig } from '@/types/tenant.types';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { StatisticsSection } from '@/components/sections/StatisticsSection';
import { RecitersSection } from '@/components/sections/RecitersSection';
import { FeaturedRecitationsSection } from '@/components/sections/FeaturedRecitationsSection';
import { RecordedMushafsSection } from '@/components/sections/RecordedMushafsSection';
import { SponsorsSection } from '@/components/sections/SponsorsSection';
import { ReciterCardProps } from '@/components/cards/ReciterCard';
import { RecitationItem } from '@/components/audio/AudioPlayer';
import { SponsorItem } from '@/components/sections/SponsorsSection';
import { getRecordedMushafs } from '@/lib/recorded-mushafs';
import { getReciters } from '@/lib/reciters';
import { getFeaturedRecitationTracks } from '@/lib/recitation-tracks';

interface SaudiCenterTemplateProps {
  tenant: TenantConfig;
  /** Base path for links: '' on custom domain, '/<tenantId>' on path-based */
  basePath?: string;
}

export async function SaudiCenterTemplate({ tenant, basePath = '' }: SaudiCenterTemplateProps) {
  const prefix = basePath || '';

  // Fetch data from APIs (pass prefix for href generation)
  const [reciters, mushafs, recitations] = await Promise.all([
    getReciters(tenant.id, prefix),
    getRecordedMushafs(tenant.id, {}, prefix),
    getFeaturedRecitationTracks(tenant.id, 5),
  ]);

  const sponsors: SponsorItem[] = [
    {
      id: '1',
      name: 'أوقاف الراجحي',
      description: 'تأسس وقف الراجحي على يد الشيخ صالح الراجحي، وهو ملتزم بتمكين المجتمعات وتخفيف حدة الفقر. نحقق ذلك من خلال مشاريع التنمية المستدامة والمساعدات الإنسانية الشاملة.',
      logo: '/images/sponsor-rajhi.png',
      website: 'https://example.com',
    },
    {
      id: '2',
      name: 'أوقاف السبيعي',
      description: 'مؤسسة عبدالله بن إبراهيم السبيعي الخيرية مؤسسة مانحة تسعى لتمكين العمل الخيري في المملكة العربية السعودية، وتقديم الخدمات والمنتجات النوعية للمستفدين منه، بما يساهم في تحقيق رؤية 2030، عبر نوعين من الدعم ( التأثير ) و ( التمكين )',
      logo: '/images/sponsor-subai.png',
      website: 'https://example.com',
    },
  ];

  const aboutFeatures = [
    {
      id: '1',
      title: 'محتوى موثوق',
      description: 'تلاوات متنوعة بمختلف\nالأساليب.',
      iconSrc: '/icons/feature-ramadhan.svg',
    },
    {
      id: '2',
      title: 'بث مباشر',
      description: 'استمع للتلاوات مباشرة على\nمدار الساعة',
      iconSrc: '/icons/feature-airdrop.svg',
    },
    {
      id: '3',
      title: 'جودة عالية',
      description: 'تسجيلات بجودة صوتية\nاستثنائية لأفضل تجربة استماع',
      iconSrc: '/icons/feature-award.svg',
    },
    {
      id: '4',
      title: 'نخبة من القراء',
      description: 'تسجيلات بجودة صوتية\nاستثنائية لأفضل تجربة استماع',
      iconSrc: '/icons/feature-muslim.svg',
    },
  ];

  return (
    <PageLayout tenant={tenant}>
      {/* Hero has a shared background that also shows behind the (desktop) transparent header */}
      <div className="relative bg-[#f6f6f4] -mt-16 lg:-mt-[72px] pt-16 lg:pt-[72px]">
        {/* Background image layer with diagonal fade (top-start -> bottom-end) */}
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-no-repeat bg-right-top bg-cover opacity-100 [mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom_left,#000_0%,#000_24%,transparent_88%)]"
          aria-hidden="true"
        />

        {/* Hero Section */}
        <HeroSection
          content={tenant.content.hero}
          basePath={basePath}
          statsCard={{
            value: '2.5M',
            label: 'استماع على جميع المنصات',
            description: 'مستمعون من مختلف أنحاء العالم',
          }}
        />
      </div>

      {/* Partners Section - separate solid background (no hero pattern) */}
      <PartnersSection />

      {/* About Section — scroll target #about */}
      <AboutSection
        id="about"
        title="عن المركز السعودي للتلاوات"
        description="المركز السعودي للتلاوات القرآنية هو منصة إسلامية رائدة تهدف إلى نشر كتاب الله الكريم بأفضل التسجيلات الصوتية، حيث نجمع تلاوات نخبة من أشهر القراء في العالم الإسلامي لتكون في متناول الجميع"
        features={aboutFeatures}
      />

      {/* Divider between About and Recorded Mushafs */}
      <div className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-[#ebe8e8]" />
        </div>
      </div>

      {/* Recorded Mushafs Section — scroll target #recorded-mushafs */}
      <RecordedMushafsSection
        id="recorded-mushafs"
        title="المصاحف المسجلة"
        description="استمع إلى القرآن الكريم بأصوات نخبة من أشهر القراء في العالم الإسلامي"
        mushafs={mushafs}
        viewAllHref={`${prefix}/recitations`}
      />

      {/* Featured Recitations Section */}
      <FeaturedRecitationsSection
        title="التلاوات المميزة"
        description="استمع لمجموعة مختارة من أجمل التلاوات القرآنية"
        recitations={recitations}
        viewAllHref={`${prefix}/recitations`}
        detailsHrefBase={`${prefix}/recitations`}
      />

      {/* Reciters Section — scroll target #reciters */}
      <RecitersSection
        id="reciters"
        title="قراء المركز"
        description="نخبة من أفضل القراء والأئمة في المملكة العربية السعودية والعالم العربي والإسلامي"
        reciters={reciters}
      />

      {/* Sponsors Section */}
      <SponsorsSection
        title="الرعاة"
        sponsors={sponsors}
      />

      {/* Statistics Section */}
      {tenant.content.statistics && tenant.content.statistics.length > 0 && (
        <StatisticsSection
          title="إحصائيات المركز"
          description="أرقام تعكس ثقة الملايين في خدماتنا لنشر كتاب الله الكريم"
          statistics={tenant.content.statistics}
        />
      )}
    </PageLayout>
  );
}
