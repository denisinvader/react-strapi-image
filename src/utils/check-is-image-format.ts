import { StrapiMediaImageFormat } from '../types';

export const checkIsImageFormat = (value: unknown): value is StrapiMediaImageFormat => (
  typeof value === 'object'
  && value !== null
  && 'url' in value
  && typeof value.url === 'string'
  && 'width' in value
  && typeof value.width === 'number'
  && 'height' in value
  && typeof value.height === 'number'
);
