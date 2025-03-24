import { ComponentPropsWithRef, CSSProperties, memo, useMemo } from 'react';
import { StrapiMediaImage } from './types';
import { computeSizesValue } from './utils/compute-sizes-value';
import { computeSrcSetValue } from './utils/compute-src-set-value';

export interface StrapiImageProps extends Omit<
  ComponentPropsWithRef<'img'>,
  'src' | 'srcSet' | 'sizes' | 'style'
> {
  image: StrapiMediaImage;
  formats?: string[];
  transformUrl?: (url: string) => string;
  sizes?: string | {
    [K: `${number}rem`]: string;
    [K: `${number}px`]: string;
    fallback?: string;
  };
  desktopFirstSizes?: boolean;
  disableSizesAutoSort?: boolean;
  aspectRatio?: 'intrinsic' | string;
  style?: Omit<CSSProperties, 'aspectRatio'>;
}

const defaultFormats = ['large', 'medium', 'small'];
const defaultTransformUrl = (url: string) => url;

export const StrapiImage = memo(function StrapiImage({
  image,
  formats = defaultFormats,
  transformUrl = defaultTransformUrl,
  sizes,
  desktopFirstSizes = false,
  disableSizesAutoSort = false,
  aspectRatio = 'intrinsic',
  style,
  alt,
  ...props
}: StrapiImageProps) {
  const srcSetValue = useMemo<string | undefined>(() => (
    computeSrcSetValue({ image, formats, transformUrl })
  ), [image, formats, transformUrl]);

  const sizesValue = useMemo<string | undefined>(() => {
    if (!srcSetValue) {
      return undefined;
    }
    return computeSizesValue({
      sizes,
      desktopFirst: desktopFirstSizes,
      disableAutoSort: disableSizesAutoSort,
    });
  }, [srcSetValue, sizes, desktopFirstSizes, disableSizesAutoSort]);

  const alternativeText = useMemo(() => {
    if (typeof alt !== 'undefined') {
      return alt;
    }
    return image.alternativeText || image.caption || image.name || '';
  }, [alt, image]);

  const aspectRatioValue = useMemo(() => {
    if (aspectRatio !== 'intrinsic') {
      return undefined;
    }
    if (!image.width || !image.height || image.width < 0 || image.height < 0) {
      return undefined;
    }
    return `${image.width} / ${image.height}`;
  }, [aspectRatio, image]);
  const styleValue = useMemo<CSSProperties | undefined>(() => {
    if (!aspectRatioValue) {
      return style;
    }
    if (typeof style === 'undefined') {
      return { aspectRatio: aspectRatioValue };
    }
    return { ...style, aspectRatio: aspectRatioValue };
  }, [aspectRatioValue, style]);

  return (
    <img
      {...props}
      src={image.url}
      srcSet={srcSetValue}
      sizes={sizesValue}
      alt={alternativeText}
      width={image.width}
      style={styleValue}
    />
  );
});
