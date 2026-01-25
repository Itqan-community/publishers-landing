'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
    {/* Use <img> to avoid Next/Image SVG safety checks for assets that may be SVG content. */}
    <img src={src} alt={alt} width={19} height={19} className="h-[19px] w-[19px] object-contain" />
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDetailsVariant = variant === 'details';
  const isFeaturedVariant = variant === 'featured';

  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  useEffect(() => {
    if (onRecitationChange) {
      onRecitationChange(selectedRecitation);
    }
  }, [selectedRecitation, onRecitationChange]);

  const handleRecitationClick = (recitation: RecitationItem) => {
    setSelectedRecitation(recitation);
    setIsPlaying(true);
  };

  const listTitleText = listTitle || (isDetailsVariant ? 'قائمة السور' : 'قائمة التلاوات');

  const selectedIndex = useMemo(() => {
    return Math.max(
      0,
      recitations.findIndex((r) => r.id === selectedRecitation.id)
    );
  }, [recitations, selectedRecitation.id]);

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < recitations.length - 1;

  const formatTime = (totalSeconds: number) => {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0:00';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = useMemo(() => {
    if (!durationSeconds || durationSeconds <= 0) return 0;
    return Math.min(1, Math.max(0, currentTimeSeconds / durationSeconds));
  }, [currentTimeSeconds, durationSeconds]);

  // Reset time when recitation changes
  useEffect(() => {
    if (!isFeaturedVariant) return;
    setCurrentTimeSeconds(0);
    setDurationSeconds(0);
  }, [selectedRecitation.id, isFeaturedVariant]);

  // Handle audio source change and playback
  useEffect(() => {
    if (!isFeaturedVariant) return;
    const audio = audioRef.current;
    if (!audio || !selectedRecitation.audioUrl) return;

    // Update audio source when recitation changes
    if (audio.src !== selectedRecitation.audioUrl) {
      audio.src = selectedRecitation.audioUrl;
      audio.load();
      setCurrentTimeSeconds(0);
      setDurationSeconds(0);
    }

    // Handle play/pause
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((error) => {
          console.error('[AudioPlayer] Play failed:', error);
          // Autoplay can be blocked; keep UI consistent with actual playback state.
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isFeaturedVariant, selectedRecitation.audioUrl]);

  const handlePrev = () => {
    if (!hasPrev) return;
    const prev = recitations[selectedIndex - 1];
    if (prev) handleRecitationClick(prev);
  };

  const handleNext = () => {
    if (!hasNext) return;
    const next = recitations[selectedIndex + 1];
    if (next) handleRecitationClick(next);
  };

  const handleTogglePlay = () => {
    setIsPlaying((v) => !v);
  };

  const handleSeek = (nextSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextSeconds;
    setCurrentTimeSeconds(nextSeconds);
  };

  return (
    <div
      className={
        isDetailsVariant
          ? 'grid gap-6 lg:grid-cols-[1fr_1.4fr]'
          : 'overflow-hidden rounded-[18px] bg-white shadow-[0px_44px_84px_0px_rgba(0,0,0,0.07)]'
      }
    >
      {!isDetailsVariant && (
        <div className="flex flex-col lg:flex-row">
          {/* List (start/right in RTL) */}
          <div className="flex-1 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col">
              {recitations.map((recitation, index) => {
                const isSelected = selectedRecitation.id === recitation.id;
                const isLast = index === recitations.length - 1;

                return (
                  <button
                    key={recitation.id}
                    type="button"
                    onClick={() => handleRecitationClick(recitation)}
                    className={[
                      'w-full text-end transition-colors',
                      isSelected
                        ? 'rounded-[18px] border border-[rgba(25,54,36,0.4)] bg-[rgba(25,54,36,0.02)]'
                        : 'bg-transparent',
                      !isSelected && !isLast ? 'border-b border-[#ebe8e8]' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                      {/* Duration (end/left) */}
                      <span className="shrink-0 font-primary text-[16px] leading-[22px] text-[#6a6a6a]">
                        {recitation.duration}
                      </span>

                      {/* Content + avatar (start/right) */}
                      <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-primary text-[18px] font-semibold leading-[22px] text-black">
                            {recitation.title}
                          </p>
                          <p className="mt-1 truncate font-primary text-[16px] leading-[22px] text-[#6a6a6a]">
                            {recitation.reciterName}
                          </p>
                        </div>

                        <div className="relative shrink-0">
                          <div className="relative size-[56px] overflow-hidden rounded-full bg-[#d9d9d9]">
                            {recitation.image ? (
                              <Image
                                src={recitation.image}
                                alt={recitation.reciterName}
                                fill
                                className="object-cover"
                              />
                            ) : null}
                          </div>

                          {isSelected && isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M11 5L7 9H4C3.44772 9 3 9.44772 3 10V14C3 14.5523 3.44772 15 4 15H7L11 19V5Z"
                                  fill="white"
                                />
                                <path
                                  d="M14.5 8.3C15.7 9.2 16.5 10.5 16.5 12C16.5 13.5 15.7 14.8 14.5 15.7"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M16.8 5.9C18.9 7.5 20.3 9.6 20.3 12C20.3 14.4 18.9 16.5 16.8 18.1"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  opacity="0.8"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player (end/left in RTL) */}
          <div className="flex-1 border-t border-[#ebe8e8] px-6 py-6 sm:px-8 sm:py-8 lg:border-t-0 lg:border-s">
            <div className="flex flex-col items-center">
              {/* Artwork */}
              <div className="relative mb-8 size-[214px] rounded-[30px] bg-white p-[7px] shadow-[0px_44px_84px_0px_rgba(0,0,0,0.07)]">
                <div className="relative h-full w-full overflow-hidden rounded-[23px] bg-[#f3f3f3]">
                  {selectedRecitation.image ? (
                    <Image
                      src={selectedRecitation.image}
                      alt={selectedRecitation.title}
                      fill
                      className="object-cover"
                      priority={false}
                    />
                  ) : null}
                </div>
              </div>

              {/* Progress */}
              <div className="w-full max-w-[343px]">
                <div className="relative h-[18px]">
                  <div className="absolute inset-y-0 start-0 end-0 flex items-center">
                    <div className="relative h-[4px] w-full rounded-full bg-[#ebe8e8]">
                      <div
                        className="absolute inset-y-0 rounded-full bg-primary"
                        style={{ width: `${progressPercent * 100}%`, insetInlineStart: 0 }}
                        aria-hidden="true"
                      />
                      <div
                        className="absolute -top-6 -translate-x-1/2 rounded-[6px] bg-primary px-2 py-1 font-primary text-[12px] leading-[1] text-white"
                        style={{ insetInlineStart: `${progressPercent * 100}%` }}
                        aria-hidden="true"
                      >
                        {durationSeconds ? formatTime(currentTimeSeconds) : selectedRecitation.duration}
                      </div>
                      <div
                        className="absolute top-1/2 size-[12px] -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary shadow-sm"
                        style={{ insetInlineStart: `${progressPercent * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <input
                    aria-label="شريط التقديم"
                    type="range"
                    min={0}
                    max={durationSeconds || 0}
                    step={0.1}
                    value={Math.min(currentTimeSeconds, durationSeconds || currentTimeSeconds)}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="absolute inset-0 h-full w-full opacity-0"
                    disabled={!durationSeconds}
                  />
                </div>

                {/* Controls + text */}
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div className="min-w-0 text-end">
                    <p className="truncate font-primary text-[18px] font-semibold leading-[22px] text-black">
                      {selectedRecitation.title}
                    </p>
                    <p className="mt-1 truncate font-primary text-[16px] leading-[22px] text-[#6a6a6a]">
                      {selectedRecitation.reciterName}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={!hasPrev}
                      aria-label="السابق"
                      className="flex size-[46px] items-center justify-center rounded-[14px] bg-white disabled:opacity-40"
                    >
                      <img src="/icons/recitations/prev.png" alt="" width={24} height={24} className="h-6 w-6" />
                    </button>

                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                      className="flex size-[46px] items-center justify-center rounded-[14px] bg-[#f3f3f3]"
                    >
                      <img
                        src={isPlaying ? '/icons/recitations/pause.png' : '/icons/recitations/play.png'}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!hasNext}
                      aria-label="التالي"
                      className="flex size-[46px] items-center justify-center rounded-[14px] bg-white disabled:opacity-40"
                    >
                      <img
                        src="/icons/recitations/prev.png"
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 rotate-180"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {selectedRecitation.audioUrl && (
                <audio
                  ref={audioRef}
                  src={selectedRecitation.audioUrl}
                  onTimeUpdate={(e) => {
                    const audio = e.currentTarget as HTMLAudioElement;
                    setCurrentTimeSeconds(audio.currentTime);
                  }}
                  onLoadedMetadata={(e) => {
                    const audio = e.currentTarget as HTMLAudioElement;
                    const duration = audio.duration || 0;
                    setDurationSeconds(duration);
                    console.log('[AudioPlayer] Metadata loaded, duration:', duration);
                  }}
                  onPlay={() => {
                    setIsPlaying(true);
                    console.log('[AudioPlayer] Playing:', selectedRecitation.audioUrl);
                  }}
                  onPause={() => {
                    setIsPlaying(false);
                    console.log('[AudioPlayer] Paused');
                  }}
                  onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTimeSeconds(0);
                    console.log('[AudioPlayer] Ended');
                  }}
                  onError={(e) => {
                    const audio = e.currentTarget as HTMLAudioElement;
                    console.error('[AudioPlayer] Audio error:', {
                      error: audio.error,
                      code: audio.error?.code,
                      message: audio.error?.message,
                      src: selectedRecitation.audioUrl,
                    });
                    setIsPlaying(false);
                  }}
                  onCanPlay={() => {
                    console.log('[AudioPlayer] Audio can play:', selectedRecitation.audioUrl);
                  }}
                  onLoadStart={() => {
                    console.log('[AudioPlayer] Loading started:', selectedRecitation.audioUrl);
                  }}
                  preload="metadata"
                  crossOrigin="anonymous"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isDetailsVariant && (
        <>
          <div>
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
      </div>

          <div>
        <div className="rounded-[12px] border border-[#ebe8e8] bg-white px-6 py-6">
          <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-end text-[33.5px] font-bold text-black">{listTitleText}</h3>
                <label className="flex w-full items-center gap-2 rounded-[10px] bg-[#f3f3f3] px-3 py-2 sm:w-[240px] flex-row-reverse">
                  <input
                    type="text"
                    placeholder="ابحث عن السورة"
                    className="w-full bg-transparent text-end text-[16px] text-[#6c737f] placeholder:text-[#6c737f] focus:outline-none"
                  />
                    <img src="/icons/recitations/search.png" alt="بحث" width={20} height={20} className="h-5 w-5" />
                </label>
            </div>

                <div className="max-h-[620px] overflow-y-auto pe-2">
                  {recitations.map((recitation) => {
                const isSelected = selectedRecitation.id === recitation.id;
                const secondaryText = recitation.surahInfo || recitation.reciterName;
                    const itemClasses = `flex w-full items-center justify-between gap-4 rounded-[10px] px-4 py-4 text-end transition-colors min-h-[72px] ${
                      isSelected ? 'bg-[#f3f3f3]' : 'border-b border-[#ebe8e8]'
                    }`;

                    return (
                      <button
                        key={recitation.id}
                        type="button"
                        onClick={() => handleRecitationClick(recitation)}
                        className={itemClasses}
                      >
                    <div className="flex-1">
                          <p className="text-[16px] font-medium text-[#1f2a37]">{recitation.title}</p>
                      <p className="mt-1 text-[14px] text-[#6a6a6a]">{secondaryText}</p>
                    </div>

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
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
