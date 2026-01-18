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
import { MushafCardProps } from '@/components/cards/MushafCard';
import { RecitationItem } from '@/components/audio/AudioPlayer';
import { SponsorItem } from '@/components/sections/SponsorsSection';

interface SaudiCenterTemplateProps {
  tenant: TenantConfig;
}

export function SaudiCenterTemplate({ tenant }: SaudiCenterTemplateProps) {
  // Mock data - in production, this would come from the tenant config or API
  const reciters: ReciterCardProps[] = [
    {
      id: '1',
      name: 'الشيخ أحمد العبيدي',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-1.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/saudi-center/reciters/1`,
    },
    {
      id: '2',
      name: 'الشيخ سامي السلمي',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-2.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/saudi-center/reciters/2`,
    },
    {
      id: '3',
      name: 'الشيخ يوسف الدوسري',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-3.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/saudi-center/reciters/3`,
    },
    {
      id: '4',
      name: 'الشيخ ياسر الدوسري',
      title: 'قارئ وإمام',
      image: '/images/reciters/reciter-4.jpg',
      publisher: 'موقع دار الإسلام',
      publisherUrl: 'https://example.com',
      href: `/saudi-center/reciters/4`,
    },
  ];

  const mushafs: MushafCardProps[] = [
    {
      id: '1',
      title: 'مصحف الحرم المكي',
      reciterName: 'الشيخ أحمد العبيدي',
      image: '/images/mushafs/mushaf-1.png',
      href: `/saudi-center/mushafs/1`,
    },
    {
      id: '2',
      title: 'مصحف الحرم المدني',
      reciterName: 'الشيخ سامي السلمي',
      image: '/images/mushafs/mushaf-2.png',
      href: `/saudi-center/mushafs/2`,
    },
    {
      id: '3',
      title: 'مصحف برواية حفص',
      reciterName: 'الشيخ يوسف الدوسري',
      image: '/images/mushafs/mushaf-3.png',
      href: `/saudi-center/mushafs/3`,
    },
    {
      id: '4',
      title: 'مصحف برواية ورش',
      reciterName: 'الشيخ ياسر الدوسري',
      image: '/images/mushafs/mushaf-4.png',
      href: `/saudi-center/mushafs/4`,
    },
  ];

  const recitations: RecitationItem[] = [
    {
      id: '1',
      title: 'سورة الكهف',
      reciterName: 'الشيخ أحمد العبيدي',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf.mp3',
      image: '/images/reciters/reciter-1.jpg',
    },
    {
      id: '2',
      title: 'سورة الكهف',
      reciterName: 'الشيخ سامي السلمي',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-2.mp3',
      image: '/images/reciters/reciter-2.jpg',
    },
    {
      id: '3',
      title: 'سورة الكهف',
      reciterName: 'الشيخ يوسف الدوسري',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-3.mp3',
      image: '/images/reciters/reciter-3.jpg',
    },
    {
      id: '4',
      title: 'سورة الكهف',
      reciterName: 'الشيخ أحمد العبيدي',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-4.mp3',
      image: '/images/reciters/reciter-1.jpg',
    },
    {
      id: '5',
      title: 'سورة الكهف',
      reciterName: 'الشيخ يوسف الدوسري',
      duration: '12:32',
      audioUrl: 'https://example.com/audio/surah-kahf-5.mp3',
      image: '/images/reciters/reciter-3.jpg',
    },
  ];

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
      {/* Hero Section */}
      <HeroSection 
        content={tenant.content.hero}
        statsCard={{
          value: '2.5M',
          label: 'استماع على جميع المنصات',
          description: 'مستمعون من مختلف أنحاء العالم',
        }}
      />

      {/* Partners Section - Part of hero visually */}
      <PartnersSection />

      {/* About Section */}
      <AboutSection
        title="عن المركز السعودي للتلاوات"
        description="المركز السعودي للتلاوات القرآنية هو منصة إسلامية رائدة تهدف إلى نشر كتاب الله الكريم بأفضل التسجيلات الصوتية، حيث نجمع تلاوات نخبة من أشهر القراء في العالم الإسلامي لتكون في متناول الجميع"
        features={aboutFeatures}
      />

      {/* Recorded Mushafs Section */}
      <RecordedMushafsSection
        title="المصاحف المسجلة"
        description="استمع إلى القرآن الكريم بأصوات نخبة من أشهر القراء في العالم الإسلامي"
        mushafs={mushafs}
        viewAllHref="/saudi-center/mushafs"
      />

      {/* Featured Recitations Section */}
      <FeaturedRecitationsSection
        title="التلاوات المميزة"
        description="استمع لمجموعة مختارة من أجمل التلاوات القرآنية"
        recitations={recitations}
        viewAllHref="/saudi-center/recitations"
        detailsHrefBase={`/${tenant.id}/recitations`}
      />

      {/* Reciters Section */}
      <RecitersSection
        title="قراء المركز"
        description="نخبة من أفضل القراء والأئمة في المملكة العربية السعودية والعالم العربي والإسلامي"
        reciters={reciters}
      />

      {/* Sponsors Section */}
      <SponsorsSection
        title="الراعيين"
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
