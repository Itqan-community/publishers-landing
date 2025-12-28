/**
 * Mock Image Placeholder Component
 * 
 * Creates placeholder images with color and text
 * In production, replace with actual image assets
 */

interface PlaceholderImageProps {
  width: number;
  height: number;
  text: string;
  bgColor?: string;
}

export function generatePlaceholderImage({
  width,
  height,
  text,
  bgColor = '0F4C81',
}: PlaceholderImageProps): string {
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/FFFFFF?text=${encodeURIComponent(text)}`;
}

// Export common placeholder images
export const placeholderImages = {
  hero: {
    default: generatePlaceholderImage({ width: 1920, height: 1080, text: 'Hero Image' }),
    academic: generatePlaceholderImage({ width: 1920, height: 1080, text: 'Academic', bgColor: '1a237e' }),
    magazine: generatePlaceholderImage({ width: 1920, height: 1080, text: 'Magazine', bgColor: 'd32f2f' }),
  },
  category: {
    newspapers: generatePlaceholderImage({ width: 800, height: 600, text: 'Newspapers' }),
    readings: generatePlaceholderImage({ width: 800, height: 600, text: 'Readings', bgColor: '00796B' }),
    media: generatePlaceholderImage({ width: 800, height: 600, text: 'Media', bgColor: '5E35B1' }),
    journals: generatePlaceholderImage({ width: 800, height: 600, text: 'Journals', bgColor: '1a237e' }),
    research: generatePlaceholderImage({ width: 800, height: 600, text: 'Research', bgColor: '0277BD' }),
    magazine: generatePlaceholderImage({ width: 800, height: 600, text: 'Magazine', bgColor: 'd32f2f' }),
    reports: generatePlaceholderImage({ width: 800, height: 600, text: 'Reports', bgColor: 'C62828' }),
  },
  speaker: {
    speaker1: generatePlaceholderImage({ width: 400, height: 500, text: 'Speaker 1', bgColor: '37474F' }),
    speaker2: generatePlaceholderImage({ width: 400, height: 500, text: 'Speaker 2', bgColor: '455A64' }),
    speaker3: generatePlaceholderImage({ width: 400, height: 500, text: 'Speaker 3', bgColor: '546E7A' }),
    prof1: generatePlaceholderImage({ width: 400, height: 500, text: 'Professor', bgColor: '1a237e' }),
  },
  reading: {
    reading1: generatePlaceholderImage({ width: 600, height: 400, text: 'Reading 1', bgColor: '00695C' }),
  },
  logo: {
    default: generatePlaceholderImage({ width: 200, height: 60, text: 'Logo', bgColor: 'FFFFFF', }),
    publisher1: generatePlaceholderImage({ width: 200, height: 60, text: 'Academic Press', bgColor: 'FFFFFF' }),
    publisher2: generatePlaceholderImage({ width: 200, height: 60, text: 'Magazine', bgColor: 'FFFFFF' }),
  },
};

