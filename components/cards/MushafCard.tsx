import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface MushafCardProps {
  id: string;
  title: string;
  reciterName: string;
  image: string;
  href?: string;
}

export const MushafCard: React.FC<MushafCardProps> = ({
  id,
  title,
  reciterName,
  image,
  href,
}) => {
  const content = (
    <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col bg-white">
      <div className="relative w-full h-80 sm:h-88 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-right text-white space-y-2">
          <h3 className="text-xl font-bold leading-tight drop-shadow">{title}</h3>
          <p className="text-sm text-white/90 drop-shadow">{reciterName}</p>
          <Button
            asChild
            size="sm"
            variant="surface"
            className="mt-2 bg-white text-primary border-none shadow-md"
          >
            <Link href={href ?? '#'}>استمع الآن</Link>
          </Button>
        </div>
      </div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
};
