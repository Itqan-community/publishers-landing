'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface ReciterCardProps {
  id: string;
  name: string;
  title: string;
  image: string;
  publisher?: string;
  publisherUrl?: string;
  href?: string;
  onViewMore?: () => void;
}

export const ReciterCard: React.FC<ReciterCardProps> = ({
  id,
  name,
  title,
  image,
  publisher,
  publisherUrl,
  href,
  onViewMore,
}) => {
  const content = (
    <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col bg-white">
      <div className="relative w-full h-96 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-right text-white space-y-2">
          <h3 className="text-xl font-bold leading-tight drop-shadow">{name}</h3>
          <p className="text-sm text-white/90 drop-shadow">{title}</p>
          <div className="pt-2">
            {onViewMore ? (
              <Button
                variant="surface"
                size="sm"
                className="bg-white text-primary border-none shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMore();
                }}
              >
                عرض المزيد
              </Button>
            ) : href ? (
              <Button
                asChild
                variant="surface"
                size="sm"
                className="bg-white text-primary border-none shadow-md"
              >
                <Link href={href}>عرض المزيد</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );

  return href && !onViewMore ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
};
