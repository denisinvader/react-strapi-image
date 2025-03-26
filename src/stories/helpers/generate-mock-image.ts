import { StrapiMediaImage } from '../../types';

interface GenerateMockImageProps {
  background?: string;
  foreground?: string;
  format?: 'jpg' | 'png';
  formats?: Record<string, number>;
  width?: number;
  height?: number;
}

export const generateMockImage = function generateMockImage({
  background = '111111',
  foreground = 'ffffff',
  format = 'jpg',
  formats = {
    thumbnail: 150,
    small: 500,
    medium: 750,
    large: 1000,
  },
  width = 1600,
  height = 900,
}: GenerateMockImageProps = {}): StrapiMediaImage {
  const getUrl = (width: number, height: number) => `https://placehold.co/${width}x${height}/${encodeURIComponent(background)}/${encodeURIComponent(foreground)}/${format}`;

  return {
    width,
    height,
    url: getUrl(width, height),
    alternativeText: null,
    formats: Object
      .keys({ ...formats, thumbnail: 150 })
      .reduce<Exclude<StrapiMediaImage['formats'], undefined>>((acc, key) => {
        const localWidth = formats[key];
        const localHeight = Math.round((localWidth * height) / width);
        acc[key] = {
          width: localWidth,
          height: localHeight,
          url: getUrl(localWidth, localHeight),
        };
        return acc;
      }, {}),
  };
};
