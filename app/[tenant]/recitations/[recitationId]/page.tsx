import Image from 'next/image';
import { notFound } from 'next/navigation';
import { loadTenantConfig } from '@/lib/tenant-config';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { FiCode, FiDownload, FiMessageCircle, FiHeart, FiShare2, FiSkipBack, FiSkipForward } from 'react-icons/fi';

const surahItems = [
  { id: '1', name: 'الفاتحة', meta: '7 آيات • مكية', isPlaying: true },
  { id: '2', name: 'البقرة', meta: '286 آية • مدنية' },
  { id: '3', name: 'آل عمران', meta: '200 آية • مدنية' },
  { id: '4', name: 'النساء', meta: '176 آية • مدنية' },
  { id: '5', name: 'المائدة', meta: '120 آية • مدنية' },
  { id: '6', name: 'الأنعام', meta: '206 آية • مكية' },
  { id: '7', name: 'الأعراف', meta: '75 آية • مدنية' },
  { id: '8', name: 'الأنفال', meta: '129 آية • مدنية' },
  { id: '9', name: 'التوبة', meta: '109 آية • مكية' },
];

const otherMushafs = [
  {
    id: 'm-1',
    title: 'الشيخ سامي السلمي',
    description: 'المصحف المرتل للشيخ سامي السلمي',
    bg: '/images/mushafs/mushaf-bg-1.png',
    book: '/images/mushafs/mushaf-book-1.png',
    avatar: '/images/mushafs/mushaf-reciter-1.png',
  },
  {
    id: 'm-2',
    title: 'الشيخ يوسف الدوسري',
    description: 'المصحف المرتل للشيخ يوسف الدوسري',
    bg: '/images/mushafs/mushaf-bg-2.png',
    book: '/images/mushafs/mushaf-book-2.png',
    avatar: '/images/mushafs/mushaf-reciter-2.png',
  },
  {
    id: 'm-3',
    title: 'الشيخ بريد القرني',
    description: 'المصحف المرتل المعلم للشيخ بريد القرني',
    bg: '/images/mushafs/mushaf-bg-3.png',
    book: '/images/mushafs/mushaf-book-3.png',
    avatar: '/images/mushafs/mushaf-reciter-3.png',
  },
  {
    id: 'm-4',
    title: 'الشيخ أحمد العبيدي',
    description: 'المصحف المرتل للشيخ أحمد العبيدي',
    bg: '/images/mushafs/mushaf-bg-4.png',
    book: '/images/mushafs/mushaf-book-4.png',
    avatar: '/images/mushafs/mushaf-reciter-4.png',
  },
];

export default async function RecitationDetailsPage({
  params,
}: {
  params: Promise<{ tenant: string; recitationId: string }>;
}) {
  const { tenant: tenantId } = await params;
  const tenant = await loadTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  return (
    <PageLayout tenant={tenant} showFooter={false}>
      <div dir="rtl" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <section className="rounded-[18px] border border-[#ebe8e8] bg-white px-6 py-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start">
              <div className="flex items-center gap-6 flex-row-reverse">
                <div className="rounded-[23px] border border-[#ebe8e8] bg-white p-2">
                  <div className="relative h-[179px] w-[179px] overflow-hidden rounded-[20px]">
                    <Image
                      src="/images/recitations/reciter-badr-turki.png"
                      alt="صورة الشيخ بدر التركي"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="text-end">
                  <h1 className="text-[28px] font-semibold text-black">الشيخ بدر التركي</h1>
                  <p className="mt-2 text-[18px] text-[#6a6a6a]">إمام الحرم المكي</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#6a6a6a]">
                  <div className="flex items-center gap-2 rounded-full border border-[#ebe8e8] px-3 py-1">
                    <FiShare2 className="h-4 w-4" />
                    <span>133 مشاركة</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-[#ebe8e8] px-3 py-1">
                    <FiMessageCircle className="h-4 w-4" />
                    <span>400 تعليق</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-[#ebe8e8] px-3 py-1">
                    <FiHeart className="h-4 w-4" />
                    <span>1,456 إعجاب</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    className="gap-2 bg-[#0d121c] text-white hover:bg-[#0a0f17]"
                  >
                    <FiCode className="h-4 w-4" />
                    API
                  </Button>
                  <Button
                    variant="secondary"
                    className="gap-2 bg-[#1b3f2d] text-white hover:bg-[#152f22]"
                  >
                    <FiDownload className="h-4 w-4" />
                    تحميل للمصحف كاملًا
                  </Button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {['مصحف مجود', 'رواية حفص عن عاصم', 'التوسط'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[10px] border border-[#ebe8e8] bg-[#f3f3f3] px-4 py-2 text-[14px] text-[#1f2a37]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-[12px] border border-[#ebe8e8] bg-white px-6 py-6">
              <div className="flex flex-col gap-6">
                <div className="h-2 w-full rounded-full bg-[#e6e6e6]">
                  <div className="h-2 w-[55%] rounded-full bg-[#f4b400]" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ebe8e8]">
                      <FiSkipForward className="h-4 w-4" />
                    </button>
                    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                      <Image
                        src="/icons/recitations/play.png"
                        alt="تشغيل"
                        width={20}
                        height={20}
                      />
                    </button>
                    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ebe8e8]">
                      <FiSkipBack className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-end">
                    <p className="text-[18px] font-semibold text-black">1. الفاتحة (Al-Fatihah)</p>
                    <p className="mt-1 text-[14px] text-[#6a6a6a]">الشيخ ياسر الدوسري</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#ebe8e8] bg-white px-6 py-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-[22px] font-semibold text-black">قائمة السور</h2>
                  <label className="flex w-full items-center gap-2 rounded-[10px] bg-[#f3f3f3] px-3 py-2 sm:w-[240px] flex-row-reverse">
                    <input
                      type="text"
                      placeholder="ابحث عن السورة"
                      className="w-full bg-transparent text-end text-[14px] text-[#6c737f] placeholder:text-[#6c737f] focus:outline-none"
                    />
                    <Image src="/icons/recitations/search.png" alt="بحث" width={20} height={20} />
                  </label>
                </div>

                <div className="max-h-[620px] overflow-y-auto pe-2">
                  {surahItems.map((surah, index) => (
                    <div
                      key={surah.id}
                      className={`flex items-center justify-between gap-4 rounded-[10px] px-4 py-4 ${
                        index === 0 ? 'bg-[#f3f3f3]' : 'border-b border-[#ebe8e8]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ActionIcon src="/icons/recitations/info.png" alt="معلومات" />
                        <ActionIcon src="/icons/recitations/download.png" alt="تحميل" />
                        <ActionIcon src="/icons/recitations/share.png" alt="مشاركة" />
                        <ActionIcon src="/icons/recitations/heart.png" alt="إعجاب" />
                        <ActionIcon
                          src={surah.isPlaying ? '/icons/recitations/pause.png' : '/icons/recitations/play.png'}
                          alt={surah.isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                        />
                      </div>
                      <div className="text-end">
                        <p className="text-[16px] font-medium text-[#1f2a37]">
                          {surah.id}. {surah.name}
                        </p>
                        <p className="mt-1 text-[14px] text-[#6a6a6a]">{surah.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16">
            <div className="flex flex-col gap-4 text-end">
              <h2 className="text-[32px] font-semibold text-black">المصاحف الأخرى</h2>
              <p className="text-[18px] text-black">
                استمع إلى القرآن الكريم بأصوات نخبة من أشهر القراء في العالم الإسلامي
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#f3f3f3]">
                <Image src="/icons/recitations/arrow-circle.png" alt="السابق" width={56} height={56} />
                <Image
                  src="/icons/recitations/arrow-right.png"
                  alt="السابق"
                  width={27}
                  height={27}
                  className="absolute rotate-180"
                />
              </button>

              <div className="flex flex-1 gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {otherMushafs.map((item) => (
                  <div
                    key={item.id}
                    className="relative h-[348px] w-[284px] flex-shrink-0 rounded-[10px] border border-[#ebe8e8] bg-white"
                  >
                    <div className="relative h-[226px] w-full overflow-hidden rounded-t-[10px]">
                      <Image src={item.bg} alt="" fill className="object-cover" />
                      <div className="absolute inset-x-0 top-[35px] flex items-center justify-center">
                        <div className="relative h-[156px] w-[156px]">
                          <Image src={item.book} alt="المصحف" fill className="object-contain" />
                        </div>
                      </div>
                      <div className="absolute top-[18px] flex w-full items-start justify-center">
                        <div className="relative h-[67px] w-[67px] overflow-hidden rounded-full border-2 border-white">
                          <Image src={item.avatar} alt={item.title} fill className="object-cover" />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-4 text-end">
                      <h3 className="text-[20px] font-semibold text-black">{item.title}</h3>
                      <p className="mt-2 text-[12px] text-[#343434]">{item.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-[#343434]">
                        <span className="rounded-[6px] bg-[#f3f3f3] px-2 py-1">سنة 1970</span>
                        <span className="rounded-[6px] bg-[#f3f3f3] px-2 py-1">التوسط</span>
                        <span className="rounded-[6px] bg-[#f3f3f3] px-2 py-1">رواية حفص عن عاصم</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#f3f3f3]">
                <Image src="/icons/recitations/arrow-circle.png" alt="التالي" width={56} height={56} />
                <Image
                  src="/icons/recitations/arrow-right.png"
                  alt="التالي"
                  width={27}
                  height={27}
                  className="absolute"
                />
              </button>
            </div>
          </section>
        </div>

        <FooterSection />
      </div>
    </PageLayout>
  );
}

function ActionIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] bg-white">
      <Image src={src} alt={alt} width={19} height={19} />
    </span>
  );
}

function FooterSection() {
  return (
    <footer className="bg-[#f6f4f1] border-t border-[#ebe8e8]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8" dir="rtl">
        <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:justify-between">
          <div className="max-w-[387px] text-end">
            <div className="flex items-center justify-end gap-3">
              <div className="relative h-[44px] w-[77px]">
                <Image src="/images/logo-icon.png" alt="شعار المركز السعودي" fill className="object-contain" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="relative h-[18px] w-[182px]">
                  <Image src="/images/logo-full.png" alt="المركز السعودي" fill className="object-contain" />
                </div>
                <div className="text-[12px] text-black">للتلاوات القرآنية والأحاديث النبوية</div>
              </div>
            </div>
            <p className="mt-6 text-[14px] leading-[1.5] text-black">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص
              العربى.
            </p>
          </div>

          <div className="flex flex-wrap justify-between gap-10 text-end lg:flex-row-reverse lg:gap-[53px]">
            <div>
              <p className="text-[16px] font-semibold text-black">عنا</p>
              <div className="mt-4 flex flex-col gap-2 text-[12px] text-black">
                <span>من نحن</span>
                <span>تواصل معنا</span>
              </div>
            </div>
            <div>
              <p className="text-[16px] font-semibold text-black">المصادر</p>
              <div className="mt-4 flex flex-col gap-2 text-[12px] text-black">
                <span>الأسئلة الشائعة</span>
                <span>الشروط</span>
                <span>الخصوصية</span>
              </div>
            </div>
            <div>
              <p className="text-[16px] font-semibold text-black">تواصل معنا</p>
              <div className="mt-4 flex flex-col gap-2 text-[12px] text-black">
                <span>hello@Saudi.sa</span>
                <span>05632222222</span>
              </div>
            </div>
            <div>
              <p className="text-[16px] font-semibold text-black">تابعنا</p>
              <div className="mt-4 flex flex-col gap-3 text-[12px] text-black">
                <div className="flex items-center justify-end gap-2">
                  <span>تويتر</span>
                  <Image src="/icons/footer/x.png" alt="تويتر" width={18} height={18} />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>انستجرام</span>
                  <Image src="/icons/footer/instagram.png" alt="انستجرام" width={18} height={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#ebe8e8] pt-6">
          <div className="flex flex-col gap-4 text-[12px] text-[#6a6a6a] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <span>سياسة الخصوصية</span>
              <span>شروط الخدمة</span>
              <span>إعدادات ملفات تعريف الارتباط</span>
            </div>
            <span>© 2024 جميع الحقوق محفوظة.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

