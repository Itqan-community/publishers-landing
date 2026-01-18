'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Image from 'next/image';

export interface RecitationItem {
  id: string;
  title: string;
  reciterName: string;
  duration: string;
  audioUrl: string;
  image?: string;
  surahInfo?: string;
}

type RecitationsPlayerVariant = 'featured' | 'details';

interface RecitationsPlayerProps {
  recitations: RecitationItem[];
  defaultSelected?: string;
  onRecitationChange?: (recitation: RecitationItem) => void;
  detailsHrefBase?: string;
  variant?: RecitationsPlayerVariant;
  listTitle?: string;
}

const ActionIcon = ({ src, alt }: { src: string; alt: string }) => (
  <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px]">
    <Image src={src} alt={alt} width={19} height={19} className="object-contain" />
  </span>
);

export const RecitationsPlayer: React.FC<RecitationsPlayerProps> = ({
  recitations,
  defaultSelected,
  onRecitationChange,
  detailsHrefBase,
  variant = 'featured',
  listTitle,
}) => {
  const [selectedRecitation, setSelectedRecitation] = useState<RecitationItem>(
    recitations.find((recitation) => recitation.id === defaultSelected) || recitations[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const isDetailsVariant = variant === 'details';

  useEffect(() => {
    if (onRecitationChange) {
      onRecitationChange(selectedRecitation);
    }
  }, [selectedRecitation, onRecitationChange]);

  const handleRecitationClick = (recitation: RecitationItem) => {
    setSelectedRecitation(recitation);
    setIsPlaying(true);
    // Auto-play when selecting a new recitation
    setTimeout(() => {
      if (playerRef.current?.audio?.current) {
        playerRef.current.audio.current.play();
      }
    }, 100);
  };

  const listTitleText = listTitle || (isDetailsVariant ? 'قائمة السور' : 'قائمة التلاوات');

  return (
    <div className={isDetailsVariant ? 'grid gap-6 lg:grid-cols-[1fr_1.4fr]' : 'grid gap-8 md:grid-cols-2'}>
      <div className={isDetailsVariant ? '' : 'order-2 md:order-1'}>
        {isDetailsVariant ? (
          <div className="rounded-[12px] border border-[#ebe8e8] bg-white px-6 py-6">
            <div className="flex flex-col gap-6">
              {selectedRecitation.image && (
                <div className="relative h-[240px] w-full overflow-hidden rounded-[10px]">
                  <Image
                    src={selectedRecitation.image}
                    alt={selectedRecitation.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="h-2 w-full rounded-full bg-[#e6e6e6]">
                <div className="h-2 w-[55%] rounded-full bg-[#f4b400]" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="text-end">
                  <p className="text-[18px] font-semibold text-black">{selectedRecitation.title}</p>
                  <p className="mt-1 text-[14px] text-[#6a6a6a]">{selectedRecitation.reciterName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#ebe8e8]">
                    <Image src="/icons/recitations/prev.png" alt="السابق" width={24} height={24} />
                  </button>
                  <button className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-black text-white">
                    <Image src="/icons/recitations/play-control.png" alt="تشغيل" width={24} height={24} />
                  </button>
                  <button className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#ebe8e8]">
                    <Image
                      src="/icons/recitations/prev.png"
                      alt="التالي"
                      width={24}
                      height={24}
                      className="rotate-180"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[12px] border border-[#ebe8e8] bg-white p-6">
            {selectedRecitation.image && (
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg">
                <Image src={selectedRecitation.image} alt={selectedRecitation.title} fill className="object-cover" />
              </div>
            )}
            <div className="mb-6 text-end">
              <h3 className="text-2xl font-bold text-black">{selectedRecitation.title}</h3>
              <p className="mt-2 text-[#6a6a6a]">{selectedRecitation.reciterName}</p>
            </div>
            <div className="custom-audio-player">
              <AudioPlayer
                ref={playerRef}
                src={selectedRecitation.audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                showJumpControls={false}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className={isDetailsVariant ? '' : 'order-1 md:order-2'}>
        <div className="rounded-[12px] border border-[#ebe8e8] bg-white px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className={isDetailsVariant ? 'flex flex-wrap items-center justify-between gap-4' : 'flex items-center justify-between'}>
              <h3
                className={isDetailsVariant ? 'text-[33.5px] font-bold text-black text-end' : 'text-lg font-semibold text-black text-end'}
              >
                {listTitleText}
              </h3>
              {isDetailsVariant && (
                <label className="flex w-full items-center gap-2 rounded-[10px] bg-[#f3f3f3] px-3 py-2 sm:w-[240px] flex-row-reverse">
                  <input
                    type="text"
                    placeholder="ابحث عن السورة"
                    className="w-full bg-transparent text-end text-[16px] text-[#6c737f] placeholder:text-[#6c737f] focus:outline-none"
                  />
                  <Image src="/icons/recitations/search.png" alt="بحث" width={20} height={20} />
                </label>
              )}
            </div>

            <div className={isDetailsVariant ? 'max-h-[620px] overflow-y-auto pe-2' : 'space-y-2'}>
              {recitations.map((recitation, index) => {
                const isSelected = selectedRecitation.id === recitation.id;
                const secondaryText = recitation.surahInfo || recitation.reciterName;
                const itemBaseClasses = `flex w-full items-center justify-between gap-4 rounded-[10px] px-4 py-4 text-end transition-colors`;
                const itemClasses = isDetailsVariant
                  ? `${itemBaseClasses} min-h-[72px] ${isSelected ? 'bg-[#f3f3f3]' : 'border-b border-[#ebe8e8]'}`
                  : `${itemBaseClasses} ${isSelected ? 'bg-[#f3f3f3]' : 'bg-white hover:bg-[#f9f9f9]'}`;

                const listItemContent = (
                  <>
                    <div className="flex-1">
                      <p className="text-[16px] font-medium text-[#1f2a37]">
                        {recitation.title}
                      </p>
                      <p className="mt-1 text-[14px] text-[#6a6a6a]">{secondaryText}</p>
                    </div>

                    {isDetailsVariant ? (
                      <div className="flex items-center gap-2">
                        <ActionIcon src="/icons/recitations/info.png" alt="معلومات" />
                        <ActionIcon src="/icons/recitations/download.png" alt="تحميل" />
                        <ActionIcon src="/icons/recitations/share.png" alt="مشاركة" />
                        <ActionIcon src="/icons/recitations/heart.png" alt="إعجاب" />
                        <ActionIcon
                          src={isSelected && isPlaying ? '/icons/recitations/pause.png' : '/icons/recitations/play-list.png'}
                          alt={isSelected && isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-[14px] text-[#6a6a6a]">
                        <span>{recitation.duration}</span>
                        {isSelected && isPlaying && <span className="h-2 w-2 rounded-full bg-black" />}
                      </div>
                    )}
                  </>
                );

                if (detailsHrefBase && !isDetailsVariant) {
                  return (
                    <Link key={recitation.id} href={`${detailsHrefBase}/${recitation.id}`} className={itemClasses}>
                      {listItemContent}
                    </Link>
                  );
                }

                return (
                  <button key={recitation.id} type="button" onClick={() => handleRecitationClick(recitation)} className={itemClasses}>
                    {listItemContent}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
