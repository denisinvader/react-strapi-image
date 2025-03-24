import { StrapiMediaImage } from '../types';

interface ComputeSrcSetValueProps {
  image: StrapiMediaImage;
  formats?: string[];
  transformUrl?: (url: string) => string;
}

export const computeSrcSetValue = function computeSrcSetValue({
  image,
  formats,
  transformUrl = (d) => d,
}: ComputeSrcSetValueProps): string | undefined {
  if (!Array.isArray(formats) || !image.formats) {
    return undefined;
  }

  let hasMatchedFormats = false;
  let result = `${transformUrl(image.url)} ${image.width}w`;
  for (const format of formats) {
    const imageFormat = image.formats[format];
    if (!imageFormat) {
      continue;
    }

    hasMatchedFormats = true;
    result += `, ${transformUrl(imageFormat.url)} ${imageFormat.width}w`;
  }

  if (!hasMatchedFormats) {
    return undefined;
  }

  return result;
};
