import { StrapiMediaImage } from '../../types';
import { intrinsic } from '../constants';

export const computeAspectRatio = function computeAspectRatio(
  image: StrapiMediaImage,
  value?: string,
): string | undefined {
  if (typeof value !== 'undefined' && value !== intrinsic) {
    return value;
  }
  if (!image.width || image.width < 0 || !image.height || image.height < 0) {
    return undefined;
  }
  return `${image.width} / ${image.height}`;
};
