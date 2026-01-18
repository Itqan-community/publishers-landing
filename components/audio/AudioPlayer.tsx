'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

export interface RecitationItem {
  id: string;
  title: string;
  reciterName: string;
  duration: string;
  audioUrl: string;
  image?: string;
}

interface AudioPlayerProps {
  recitations: RecitationItem[];
  defaultSelected?: string;
  onRecitationChange?: (recitation: RecitationItem) => void;
  detailsHrefBase?: string;
}

export const AudioPlayerComponent: React.FC<AudioPlayerProps> = ({
  recitations,
  defaultSelected,
  onRecitationChange,
  detailsHrefBase,
}) => {
  const [selectedRecitation, setSelectedRecitation] = useState<RecitationItem>(
    recitations.find(r => r.id === defaultSelected) || recitations[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);

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

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Preview Section (Left) */}
      <div className="order-2 md:order-1">
        <Card variant="elevated" className="p-6">
          {selectedRecitation.image && (
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
              <Image
                src={selectedRecitation.image}
                alt={selectedRecitation.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedRecitation.title}
            </h3>
            <p className="text-gray-600">{selectedRecitation.reciterName}</p>
          </div>

          {/* Audio Player */}
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
        </Card>
      </div>

      {/* List Section (Right) */}
      <div className="order-1 md:order-2">
        <Card variant="outlined" className="p-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            قائمة التلاوات
          </h3>
          
          <div className="space-y-2">
            {recitations.map((recitation) => {
              const isSelected = selectedRecitation.id === recitation.id;
              const itemClasses = `w-full p-4 rounded-lg text-right transition-all duration-200 ${
                isSelected
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
              }`;
              
              if (detailsHrefBase) {
                return (
                  <Link
                    key={recitation.id}
                    href={`${detailsHrefBase}/${recitation.id}`}
                    className={itemClasses}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium mb-1 truncate ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          {recitation.title}
                        </h4>
                        <p className={`text-sm truncate ${
                          isSelected ? 'text-white/90' : 'text-gray-600'
                        }`}>
                          {recitation.reciterName}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-sm ${
                          isSelected ? 'text-white/90' : 'text-gray-500'
                        }`}>
                          {recitation.duration}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <button
                  key={recitation.id}
                  onClick={() => handleRecitationClick(recitation)}
                  className={itemClasses}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium mb-1 truncate ${
                        isSelected ? 'text-white' : 'text-gray-900'
                      }`}>
                        {recitation.title}
                      </h4>
                      <p className={`text-sm truncate ${
                        isSelected ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {recitation.reciterName}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-sm ${
                        isSelected ? 'text-white/90' : 'text-gray-500'
                      }`}>
                        {recitation.duration}
                      </span>
                      {isSelected && isPlaying && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

    </div>
  );
};
