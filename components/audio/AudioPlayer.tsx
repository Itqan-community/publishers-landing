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
    <img src={src} alt={alt} width={19} height={19} className="h-[19px] w-[19px] object-contain" />
  </span>
);

// Design icons from Figma: play.svg, next-prev.svg, next-prev-reversed.svg. stroke=currentColor for theming.
const PlayIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
  </svg>
);
const PrevIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="h-6 w-6 rtl:rotate-180" aria-hidden>
    <path d="M8.06492 12.6258C8.31931 13.8374 9.67295 14.7077 12.3802 16.4481C15.3247 18.3411 16.797 19.2876 17.9895 18.9229C18.3934 18.7994 18.7654 18.5823 19.0777 18.2876C20 17.4178 20 15.6118 20 12C20 8.38816 20 6.58224 19.0777 5.71235C18.7654 5.41773 18.3934 5.20057 17.9895 5.07707C16.797 4.71243 15.3247 5.6589 12.3802 7.55186C9.67295 9.29233 8.31931 10.1626 8.06492 11.3742C7.97836 11.7865 7.97836 12.2135 8.06492 12.6258Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    <path d="M4 4L4 20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
);
const NextIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="h-6 w-6 scale-x-[-1]" aria-hidden>
    <path d="M15.9351 12.6258C15.6807 13.8374 14.327 14.7077 11.6198 16.4481C8.67528 18.3411 7.20303 19.2876 6.01052 18.9229C5.60662 18.7994 5.23463 18.5823 4.92227 18.2876C4 17.4178 4 15.6118 4 12C4 8.38816 4 6.58224 4.92227 5.71235C5.23463 5.41773 5.60662 5.20057 6.01052 5.07707C7.20304 4.71243 8.67528 5.6589 11.6198 7.55186C14.327 9.29233 15.6807 10.1626 15.9351 11.3742C16.0216 11.7865 16.0216 12.2135 15.9351 12.6258Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    <path d="M20 4L20 20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
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
          {/* List at start (right in RTL, left in LTR). flex-1 + min-w-0 so it shrinks. */}
          <div className="min-w-0 flex-1 px-6 py-6 sm:px-8 sm:py-8">
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
                      'w-full transition-colors',
                      isSelected
                        ? 'rounded-[18px] border border-[rgba(25,54,36,0.4)] bg-[rgba(25,54,36,0.02)]'
                        : 'bg-transparent',
                      !isSelected && !isLast ? 'border-b border-[#ebe8e8]' : '',
                    ].join(' ')}
                  >
                    {/* RTL-first: [Avatar + Title] at start (right in RTL), [Duration] at end (left). Flips in LTR. */}
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                      {/* Content + avatar: at start. Order: avatar then text so in RTL [Avatar|Title] from start. */}
                      <div className="flex min-w-0 flex-1 items-center justify-start gap-4">
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
                        <div className="min-w-0">
                          <p className="truncate font-primary text-[18px] font-semibold leading-[22px] text-black">
                            {recitation.title}
                          </p>
                          <p className="mt-1 truncate font-primary text-[16px] leading-[22px] text-[#6a6a6a]">
                            {recitation.reciterName}
                          </p>
                        </div>
                      </div>
                      {/* Duration: at end (left in RTL, right in LTR) */}
                      <span className="shrink-0 font-primary text-[16px] leading-[22px] text-[#6a6a6a]">
                        {recitation.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player at end (left in RTL, right in LTR). Border: block-start on mobile, inline-start on lg. */}
          <div className="min-w-0 flex-1 border-t border-[#ebe8e8] px-6 py-6 sm:px-8 sm:py-8 lg:border-t-0 lg:border-s">
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

              {/* Progress — track #ebe8e8, fill/thumb/chip #193624 (primary). Chip rounded-[8px]. */}
              <div className="w-full max-w-[343px]">
                <div className="relative h-[18px]">
                  <div className="absolute inset-y-0 start-0 end-0 flex items-center">
                    <div className="relative h-[4px] w-full rounded-full bg-[#ebe8e8]">
                      <div
                        className="absolute inset-y-0 rounded-full bg-[#193624]"
                        style={{ width: `${progressPercent * 100}%`, insetInlineStart: 0 }}
                        aria-hidden="true"
                      />
                      <div
                        className="absolute -top-6 -translate-x-1/2 rounded-[8px] bg-[#193624] px-2.5 py-1 font-primary text-[12px] leading-[1] text-white"
                        style={{ insetInlineStart: `${progressPercent * 100}%` }}
                        aria-hidden="true"
                      >
                        {durationSeconds ? formatTime(currentTimeSeconds) : selectedRecitation.duration}
                      </div>
                      <div
                        className="absolute top-1/2 size-[12px] -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#193624] shadow-sm"
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
                  <div className="min-w-0">
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
                      className="flex size-[46px] items-center justify-center rounded-[14px] bg-white text-[#161616] disabled:opacity-40"
                    >
                      <PrevIcon />
                    </button>

                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                      className="flex size-[46px] items-center justify-center rounded-[14px] bg-[#f3f3f3] text-[#161616]"
                    >
                      {isPlaying ? <img src="/icons/recitations/pause.png" alt="" width={24} height={24} className="h-6 w-6" /> : <PlayIcon />}
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!hasNext}
                      aria-label="التالي"
                      className="flex size-[46px] items-center justify-center rounded-[14px] bg-white text-[#161616] disabled:opacity-40"
                    >
                      <NextIcon />
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
                <div>
                  <p className="text-[18px] font-semibold text-black">{selectedRecitation.title}</p>
                  <p className="mt-1 text-[14px] text-[#6a6a6a]">{selectedRecitation.reciterName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#ebe8e8] text-[#161616]" aria-label="السابق">
                    <PrevIcon />
                  </button>
                  <button className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-black text-white" aria-label="تشغيل">
                    <PlayIcon />
                  </button>
                  <button className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[#ebe8e8] text-[#161616]" aria-label="التالي">
                    <NextIcon />
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
                  <h3 className="text-[33.5px] font-bold text-black">{listTitleText}</h3>
                <label className="flex w-full items-center gap-2 rounded-[10px] bg-[#f3f3f3] px-3 py-2 sm:w-[240px] flex-row-reverse">
                  <input
                    type="text"
                    placeholder="ابحث عن السورة"
                    className="w-full bg-transparent text-[16px] text-[#6c737f] placeholder:text-[#6c737f] focus:outline-none"
                  />
                    <img src="/icons/recitations/search.png" alt="بحث" width={20} height={20} className="h-5 w-5" />
                </label>
            </div>

                <div className="max-h-[620px] overflow-y-auto pe-2">
                  {recitations.map((recitation) => {
                const isSelected = selectedRecitation.id === recitation.id;
                const secondaryText = recitation.surahInfo || recitation.reciterName;
                    const itemClasses = `flex w-full items-center justify-between gap-4 rounded-[10px] px-4 py-4 transition-colors min-h-[72px] ${
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
                        <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] text-[#161616]" aria-label={isSelected && isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}>
                          {isSelected && isPlaying ? (
                            <img src="/icons/recitations/pause.png" alt="" width={19} height={19} className="h-[19px] w-[19px] object-contain" />
                          ) : (
                            <span className="[&_svg]:h-[19px] [&_svg]:w-[19px]"><PlayIcon /></span>
                          )}
                        </span>
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
