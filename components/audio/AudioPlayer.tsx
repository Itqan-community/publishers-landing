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

const UserIcon = ({ className = "h-full w-full" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PauseIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <path d="M13.4538 2.57953L13.4929 2.57953L13.5321 2.57953H13.5322C14.0599 2.5795 14.5145 2.57948 14.8786 2.62843C15.2688 2.68089 15.6429 2.7992 15.9462 3.10258C16.2496 3.40597 16.3679 3.78001 16.4204 4.17021C16.4694 4.53432 16.4693 4.98899 16.4693 5.51669V13.532C16.4693 14.0597 16.4694 14.5144 16.4204 14.8785C16.3679 15.2687 16.2496 15.6427 15.9462 15.9461C15.6429 16.2495 15.2688 16.3678 14.8786 16.4202C14.5145 16.4692 14.0598 16.4692 13.5321 16.4691H13.5321H13.4538H13.4538C12.9261 16.4692 12.4714 16.4692 12.1073 16.4202C11.7171 16.3678 11.343 16.2495 11.0397 15.9461C10.7363 15.6427 10.618 15.2687 10.5655 14.8785C10.5165 14.5144 10.5166 14.0597 10.5166 13.532V13.532V5.51669V5.51665C10.5166 4.98897 10.5165 4.53431 10.5655 4.17021C10.618 3.78001 10.7363 3.40597 11.0397 3.10258C11.343 2.7992 11.7171 2.68089 12.1073 2.62843C12.4714 2.57948 12.926 2.5795 13.4537 2.57953H13.4538Z" fill="currentColor" />
    <path d="M5.51675 2.57953L5.55594 2.57953L5.59512 2.57953H5.59517C6.12285 2.5795 6.57751 2.57948 6.9416 2.62843C7.33181 2.68089 7.70585 2.7992 8.00923 3.10258C8.31262 3.40597 8.43092 3.78001 8.48339 4.17021C8.53234 4.53432 8.53231 4.98899 8.53228 5.51669V13.532C8.53231 14.0597 8.53234 14.5144 8.48339 14.8785C8.43092 15.2687 8.31262 15.6427 8.00923 15.9461C7.70585 16.2495 7.33181 16.3678 6.9416 16.4202C6.5775 16.4692 6.12283 16.4692 5.59513 16.4691H5.59512H5.51675H5.51675C4.98905 16.4692 4.53438 16.4692 4.17028 16.4202C3.78007 16.3678 3.40603 16.2495 3.10264 15.9461C2.79926 15.6427 2.68095 15.2687 2.62849 14.8785C2.57954 14.5144 2.57956 14.0597 2.57959 13.532V13.532V5.51669V5.51665C2.57956 4.98897 2.57954 4.53431 2.62849 4.17021C2.68095 3.78001 2.79926 3.40597 3.10264 3.10258C3.40603 2.7992 3.78007 2.68089 4.17028 2.62843C4.53437 2.57948 4.98903 2.5795 5.51671 2.57953H5.51675Z" fill="currentColor" />
  </svg>
);

const DownloadIcon = ({ className = "h-[19px] w-[19px]" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <path d="M4.76221 15.8738L14.2865 15.8738" stroke="currentColor" strokeWidth="1.19054" strokeLinecap="round" />
    <path d="M9.52441 12.6991V3.17479" stroke="currentColor" strokeWidth="1.19054" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.6991 9.52435C12.6991 9.52435 10.361 12.6991 9.52435 12.6991C8.68774 12.6991 6.34961 9.52433 6.34961 9.52433" stroke="currentColor" strokeWidth="1.19054" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.1665 1.04166C4.67919 1.04166 1.0415 4.67934 1.0415 9.16666C1.0415 13.654 4.67919 17.2917 9.1665 17.2917C11.1852 17.2917 13.0319 16.5555 14.4529 15.3369L17.8912 18.7753C18.1353 19.0193 18.531 19.0193 18.7751 18.7753C19.0192 18.5312 19.0192 18.1355 18.7751 17.8914L15.3368 14.453C16.5553 13.0321 17.2915 11.1853 17.2915 9.16666C17.2915 4.67934 13.6538 1.04166 9.1665 1.04166ZM2.2915 9.16666C2.2915 5.3697 5.36955 2.29166 9.1665 2.29166C12.9635 2.29166 16.0415 5.3697 16.0415 9.16666C16.0415 12.9636 12.9635 16.0417 9.1665 16.0417C5.36955 16.0417 2.2915 12.9636 2.2915 9.16666Z" fill="currentColor" />
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
  const [selectedRecitation, setSelectedRecitation] = useState<RecitationItem | null>(
    recitations.length > 0
      ? (recitations.find((recitation) => recitation.id === defaultSelected) || recitations[0])
      : null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** Ignore onPause/onPlay from previous source when switching tracks to avoid UI flicker. */
  const isSwitchingTrackRef = useRef(false);
  const isDetailsVariant = variant === 'details';

  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  /** Frontend search in details variant track list (backend search can be added later). */
  const [trackSearchQuery, setTrackSearchQuery] = useState('');

  useEffect(() => {
    if (onRecitationChange && selectedRecitation) {
      onRecitationChange(selectedRecitation);
    }
  }, [selectedRecitation, onRecitationChange]);

  const handleRecitationClick = (recitation: RecitationItem) => {

    // If clicking the already-selected track, toggle play/pause (so pause icon on card works)
    if (selectedRecitation?.id === recitation.id) {
      handleTogglePlay();
      return;
    }
    setSelectedRecitation(recitation);
    setIsPlaying(true);
  };

  const listTitleText = listTitle || (isDetailsVariant ? 'قائمة السور' : 'قائمة التلاوات');

  // Update selectedRecitation when recitations change
  useEffect(() => {
    if (recitations.length > 0 && (!selectedRecitation || !recitations.find(r => r.id === selectedRecitation.id))) {
      const newSelected = recitations.find((recitation) => recitation.id === defaultSelected) || recitations[0];
      if (newSelected) {
        setSelectedRecitation(newSelected);
      }
    }
  }, [recitations, defaultSelected, selectedRecitation]);

  const selectedIndex = useMemo(() => {
    if (!selectedRecitation) return -1;
    return Math.max(
      0,
      recitations.findIndex((r) => r.id === selectedRecitation.id)
    );
  }, [recitations, selectedRecitation?.id]);

  /** Filtered track list for details variant (frontend search by title, reciter, surahInfo). */
  const filteredRecitations = useMemo(() => {
    if (!isDetailsVariant) return recitations;
    const q = trackSearchQuery.trim().toLowerCase();
    if (!q) return recitations;
    return recitations.filter((r) => {
      const title = (r.title ?? '').toLowerCase();
      const reciter = (r.reciterName ?? '').toLowerCase();
      const surahInfo = (r.surahInfo ?? '').toLowerCase();
      return title.includes(q) || reciter.includes(q) || surahInfo.includes(q);
    });
  }, [recitations, trackSearchQuery, isDetailsVariant]);

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

  // Helper function to validate and normalize audio URL
  const getValidAudioUrl = (url: string | undefined): string | null => {
    if (!url || url.trim() === '') {
      return null;
    }

    const trimmedUrl = url.trim();

    // If it's already an absolute URL, return it
    try {
      const urlObj = new URL(trimmedUrl);
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return trimmedUrl;
      }
    } catch {
      // Not a valid absolute URL, might be relative
    }

    // If it starts with /, it's a relative URL - convert to absolute
    if (trimmedUrl.startsWith('/')) {
      try {
        return new URL(trimmedUrl, window.location.origin).href;
      } catch {
        console.warn('[AudioPlayer] Failed to convert relative URL:', trimmedUrl);
        return null;
      }
    }

    // Try to construct a valid URL
    try {
      return new URL(trimmedUrl, window.location.origin).href;
    } catch {
      console.warn('[AudioPlayer] Invalid audio URL format:', trimmedUrl);
      return null;
    }
  };

  // Memoize the valid audio URL to avoid recalculating
  const validAudioUrl = useMemo(() => {
    if (!selectedRecitation) return null;
    const url = getValidAudioUrl(selectedRecitation.audioUrl);
    return url;
  }, [selectedRecitation?.audioUrl, selectedRecitation?.id, selectedRecitation?.title]);

  // Reset time when recitation changes
  useEffect(() => {
    setCurrentTimeSeconds(0);
    setDurationSeconds(0);
  }, [selectedRecitation?.id]);

  // Handle audio source change and playback (featured and details)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.warn('[AudioPlayer] Audio ref is null');
      return;
    }

    if (!selectedRecitation) {
      console.warn('[AudioPlayer] No selected recitation');
      return;
    }



    if (!validAudioUrl) {
      console.warn('[AudioPlayer] Invalid or missing audio URL:', {
        selectedRecitationId: selectedRecitation.id,
        selectedRecitationTitle: selectedRecitation.title,
        audioUrl: selectedRecitation.audioUrl,
      });
      setIsPlaying(false);
      // Clear the audio source to prevent errors
      if (audio.src) {
        audio.src = '';
        audio.load();
      }
      return;
    }

    // Update audio source when recitation changes
    const currentSrc = audio.src;

    if (currentSrc !== validAudioUrl) {

      isSwitchingTrackRef.current = true;
      audio.pause(); // Stop current playback so a new load() doesn't interrupt an in-flight play()
      audio.src = validAudioUrl;
      audio.load();
      setCurrentTimeSeconds(0);
      setDurationSeconds(0);
    }

    // Handle play/pause
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((error) => {
          // Interrupted by a new load() when user switched track — ignore, don't update state
          if (error?.name === 'AbortError' || error?.message?.includes('interrupted')) {
            return;
          }
          console.error('[AudioPlayer] Play failed:', error, 'URL:', validAudioUrl);
          isSwitchingTrackRef.current = false;
          setIsPlaying(false);
        });
      }
    } else {
      isSwitchingTrackRef.current = false;
      audio.pause();
    }
  }, [isPlaying, validAudioUrl, selectedRecitation?.audioUrl, selectedRecitation]);

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
      dir="rtl"
      className={
        isDetailsVariant
          ? 'grid gap-6 lg:grid-cols-[1.4fr_1fr]'
          : 'overflow-hidden rounded-[18px] bg-white shadow-[0px_44px_84px_0px_rgba(0,0,0,0.07)]'
      }
    >
      {!isDetailsVariant && (
        <div className="flex flex-col lg:flex-row">
          {/* List at start (right in RTL, left in LTR). flex-1 + min-w-0 so it shrinks. */}
          <div className="min-w-0 flex-1 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col">
              {recitations.map((recitation, index) => {
                const isSelected = selectedRecitation?.id === recitation.id;
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
                    {/* RTL-first: [Title] at start (featured: no avatar); [Duration] at end. Details variant keeps avatar. */}
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                      <div className="flex min-w-0 flex-1 items-center justify-start gap-4">
                        {isDetailsVariant && (
                          <div className="relative shrink-0">
                            <div className="relative size-[56px] overflow-hidden rounded-full bg-[#d9d9d9] flex items-center justify-center">
                              {recitation.image?.trim() ? (
                                <Image
                                  key={recitation.image}
                                  src={recitation.image}
                                  alt={`صورة القارئ ${recitation.reciterName}`}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      const userIcon = parent.querySelector('.user-icon-fallback');
                                      if (userIcon) {
                                        (userIcon as HTMLElement).style.display = 'flex';
                                      }
                                    }
                                  }}
                                />
                              ) : null}
                              <div className={`user-icon-fallback absolute inset-0 flex items-center justify-center text-[#6a6a6a] ${recitation.image?.trim() ? 'hidden' : 'flex'}`}>
                                <UserIcon className="h-8 w-8" />
                              </div>
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
                        )}
                        <div className="min-w-0 text-start">
                          <p className="truncate text-[18px] font-semibold leading-[22px] text-black">
                            {(recitation.title || '').replace(/^\d+\.\s*/, '')}
                          </p>
                          <p className="mt-1 truncate text-[16px] leading-[22px] text-[#6a6a6a]">
                            {recitation.reciterName}
                          </p>
                        </div>
                      </div>
                      {/* Duration: at end (left in RTL, right in LTR) */}
                      <span className="shrink-0 text-[16px] leading-[22px] text-[#6a6a6a]">
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
              {/* Artwork: featured = track name text only; details = image or user icon */}
              <div className="relative mb-8 size-[214px] rounded-[30px] bg-white p-[7px] shadow-[0px_44px_84px_0px_rgba(0,0,0,0.07)]">
                <div className="relative h-full w-full overflow-hidden rounded-[23px] bg-[#f3f3f3] flex items-center justify-center px-4">
                  {isDetailsVariant ? (
                    <>
                      {selectedRecitation?.image?.trim() ? (
                        <Image
                          key={selectedRecitation.image}
                          src={selectedRecitation.image}
                          alt={`صورة القارئ ${selectedRecitation?.reciterName} - ${selectedRecitation?.title}`}
                          fill
                          className="object-cover"
                          priority={false}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const userIcon = parent.querySelector('.user-icon-fallback');
                              if (userIcon) {
                                (userIcon as HTMLElement).style.display = 'flex';
                              }
                            }
                          }}
                        />
                      ) : null}
                      <div className={`user-icon-fallback absolute inset-0 flex items-center justify-center text-[#6a6a6a] ${selectedRecitation?.image?.trim() ? 'hidden' : 'flex'}`}>
                        <UserIcon className="h-20 w-20" />
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-[20px] font-semibold leading-[1.4] text-[#343434]">
                      {(selectedRecitation?.title || '').replace(/^\d+\.\s*/, '')}
                    </p>
                  )}
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
                        className="absolute -top-6 -translate-x-1/2 rounded-[8px] bg-[#193624] px-2.5 py-1 text-[12px] leading-[1] text-white"
                        style={{ insetInlineStart: `${progressPercent * 100}%` }}
                        aria-hidden="true"
                      >
                        {durationSeconds ? formatTime(currentTimeSeconds) : selectedRecitation?.duration || '0:00'}
                      </div>
                      <div
                        className="absolute top-1/2 size-[12px] -translate-y-1/2 rounded-full bg-[#193624] shadow-sm"
                        style={{
                          insetInlineStart: progressPercent === 0
                            ? '0px'
                            : progressPercent === 1
                              ? 'calc(100% - 12px)'
                              : `calc(${progressPercent * 100}% - 6px)`
                        }}
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
                  <div className="min-w-0 text-start">
                    <p className="truncate text-[18px] font-semibold leading-[22px] text-black">
                      {(selectedRecitation?.title || '').replace(/^\d+\.\s*/, '')}
                    </p>
                    <p className="mt-1 truncate text-[16px] leading-[22px] text-[#6a6a6a]">
                      {selectedRecitation?.reciterName || ''}
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
                      {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon />}
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

              <audio
                ref={audioRef}
                src={validAudioUrl || undefined}
                onTimeUpdate={(e) => {
                  const audio = e.currentTarget as HTMLAudioElement;
                  setCurrentTimeSeconds(audio.currentTime);
                }}
                onLoadedMetadata={(e) => {
                  const audio = e.currentTarget as HTMLAudioElement;
                  const duration = audio.duration || 0;
                  setDurationSeconds(duration);
                }}
                onPlay={() => {
                  isSwitchingTrackRef.current = false;
                  setIsPlaying(true);
                }}
                onPause={() => {
                  if (isSwitchingTrackRef.current) return;
                  setIsPlaying(false);
                }}
                onEnded={() => {
                  if (isSwitchingTrackRef.current) return;
                  setIsPlaying(false);
                  setCurrentTimeSeconds(0);
                }}
                onError={(e) => {
                  const audio = e.currentTarget as HTMLAudioElement;
                  const errorCode = audio.error?.code;
                  const errorMessage = audio.error?.message;

                  // Only log errors that aren't just empty/invalid sources
                  if (errorCode !== undefined && errorCode !== 4) { // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED
                    // Debug log removed
                  } else if (!validAudioUrl || validAudioUrl.trim() === '') {
                    console.warn('[AudioPlayer] No valid audio URL provided');
                  }
                  if (!isSwitchingTrackRef.current) setIsPlaying(false);
                }}
                onCanPlay={() => {
                  // Audio ready to play
                }}
                onLoadStart={() => {
                  // Audio loading started
                }}
                preload="metadata"
              />
            </div>
          </div>
        </div>
      )}

      {isDetailsVariant && (
        <>
          {/* List first (start side in RTL = right) */}
          <div>
            <div className="rounded-[12px] border border-[#ebe8e8] bg-white px-6 py-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-[33.5px] font-bold text-black">{listTitleText}</h3>
                  <label className="flex w-full items-center gap-2 rounded-[10px] bg-[#f3f3f3] px-3 py-2 sm:w-[240px] flex-row-reverse">
                    <input
                      type="text"
                      placeholder="ابحث عن السورة"
                      value={trackSearchQuery}
                      onChange={(e) => setTrackSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-[16px] text-[#6c737f] placeholder:text-[#6c737f] focus:outline-none"
                      aria-label="ابحث عن السورة"
                    />
                    <SearchIcon className="h-5 w-5 shrink-0 text-[#161616]" />
                  </label>
                </div>

                <div className="max-h-[620px] overflow-y-auto pe-2">
                  {filteredRecitations.map((recitation) => {
                    const isSelected = selectedRecitation?.id === recitation.id;
                    const secondaryText = recitation.surahInfo || recitation.reciterName;
                    const itemClasses = `flex w-full items-center justify-between gap-4 rounded-[10px] px-4 py-4 transition-colors min-h-[72px] ${isSelected ? 'bg-[#f3f3f3]' : 'border-b border-[#ebe8e8]'
                      }`;
                    const downloadUrl = getValidAudioUrl(recitation.audioUrl);
                    const downloadFilename = `${(recitation.title || 'track').replace(/^\d+\.\s*/, '').replace(/[<>:"/\\|?*]/g, '').trim() || 'audio'}.mp3`;

                    return (
                      <div key={recitation.id} className={itemClasses}>
                        <button
                          type="button"
                          onClick={() => handleRecitationClick(recitation)}
                          className="flex-1 min-w-0 text-start"
                        >
                          <p className="text-[16px] font-medium text-[#1f2a37]">{(recitation.title || '').replace(/^\d+\.\s*/, '')}</p>
                          <p className="mt-1 text-[14px] text-[#6a6a6a]">{secondaryText}</p>
                        </button>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRecitationClick(recitation)}
                            className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] text-[#161616] hover:bg-black/5 transition-colors"
                            aria-label={isSelected && isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                          >
                            {isSelected && isPlaying ? (
                              <PauseIcon className="h-[19px] w-[19px]" />
                            ) : (
                              <span className="[&_svg]:h-[19px] [&_svg]:w-[19px]"><PlayIcon /></span>
                            )}
                          </button>
                          {downloadUrl ? (
                            <a
                              href={downloadUrl}
                              download={downloadFilename}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] text-[#161616] hover:bg-black/5 transition-colors"
                              aria-label="تحميل"
                            >
                              <DownloadIcon className="h-[19px] w-[19px]" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Player second (end side in RTL = left) — same preview shape & controls as featured */}
          <div>
            <div className="rounded-[12px] border border-[#ebe8e8] bg-white px-6 py-6">
              <div className="flex flex-col items-center gap-6">
                {/* Preview: rounded rectangle like featured (not circle) */}
                <div className="relative mb-2 size-[214px] shrink-0 rounded-[30px] bg-white p-[7px] shadow-[0px_44px_84px_0px_rgba(0,0,0,0.07)]">
                  <div className="relative h-full w-full overflow-hidden rounded-[23px] bg-[#f3f3f3] flex items-center justify-center px-4">
                    {selectedRecitation?.image?.trim() ? (
                      <>
                        <Image
                          key={selectedRecitation.image}
                          src={selectedRecitation.image}
                          alt={`صورة القارئ ${selectedRecitation?.reciterName} - ${selectedRecitation?.title}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const userIcon = parent.querySelector('.user-icon-fallback');
                              if (userIcon) {
                                (userIcon as HTMLElement).style.display = 'flex';
                              }
                            }
                          }}
                        />
                        <div className="user-icon-fallback absolute inset-0 hidden items-center justify-center text-[#6a6a6a]">
                          <UserIcon className="h-20 w-20" />
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-[20px] font-semibold leading-[1.4] text-[#343434]">
                        {(selectedRecitation?.title || '').replace(/^\d+\.\s*/, '')}
                      </p>
                    )}
                  </div>
                </div>
                {/* Progress: time above, orange seekable bar */}
                <div className="w-full max-w-[343px]">
                  <p className="mb-2 text-center text-[14px] text-[#6a6a6a]">
                    {durationSeconds ? formatTime(currentTimeSeconds) : selectedRecitation?.duration || '0:00'}
                  </p>
                  <div className="relative h-[18px]">
                    <div className="absolute inset-y-0 start-0 end-0 flex items-center">
                      <div className="relative h-[4px] w-full rounded-full bg-[#e6e6e6]">
                        <div
                          className="absolute inset-y-0 rounded-full bg-[#f4b400]"
                          style={{ width: `${progressPercent * 100}%`, insetInlineStart: 0 }}
                          aria-hidden
                        />
                        <div
                          className="absolute top-1/2 size-[12px] -translate-y-1/2 rounded-full bg-[#f4b400] shadow-sm"
                          style={{
                            insetInlineStart: progressPercent === 0
                              ? '0px'
                              : progressPercent === 1
                                ? 'calc(100% - 12px)'
                                : `calc(${progressPercent * 100}% - 6px)`
                          }}
                          aria-hidden
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
                </div>
                {/* Controls: same as featured — rounded-[14px], Prev/Next white, Play gray */}
                <div className="flex items-center justify-center gap-2">
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
                    {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon />}
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
                {/* Track title + reciter below controls */}
                <div className="w-full text-start">
                  <p className="truncate text-[18px] font-semibold text-black">{(selectedRecitation?.title || '').replace(/^\d+\.\s*/, '')}</p>
                  <p className="mt-1 truncate text-[14px] text-[#6a6a6a]">{selectedRecitation?.reciterName || ''}</p>
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={validAudioUrl || undefined}
              onTimeUpdate={(e) => setCurrentTimeSeconds(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDurationSeconds(e.currentTarget.duration || 0)}
              onPlay={() => {
                isSwitchingTrackRef.current = false;
                setIsPlaying(true);
              }}
              onPause={() => {
                if (isSwitchingTrackRef.current) return;
                setIsPlaying(false);
              }}
              onEnded={() => {
                if (isSwitchingTrackRef.current) return;
                setIsPlaying(false);
                setCurrentTimeSeconds(0);
              }}
              onError={(e) => {
                const audio = e.currentTarget as HTMLAudioElement;
                const errorCode = audio.error?.code;
                const errorMessage = audio.error?.message;

                if (errorCode !== undefined && errorCode !== 4) {
                  console.error('[AudioPlayer] Audio error:', {
                    error: audio.error,
                    code: errorCode,
                    message: errorMessage,
                    src: validAudioUrl,
                    originalUrl: selectedRecitation?.audioUrl,
                  });
                } else if (!validAudioUrl || validAudioUrl.trim() === '') {
                  console.warn('[AudioPlayer] No valid audio URL provided');
                }
                if (!isSwitchingTrackRef.current) setIsPlaying(false);
              }}
              preload="metadata"
            />
          </div>
        </>
      )}
    </div>
  );
};
