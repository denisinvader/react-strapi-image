import { ComponentPropsWithRef, CSSProperties, memo, useMemo } from 'react';
import { StrapiMediaImage } from './types';
import { computeSizesValue } from './utils/compute-sizes-value';
import { computeSrcSetValue } from './utils/compute-src-set-value';
import { useStrapiImageConfigContext } from './StrapiImageConfigContext';
import { computeAspectRatio } from './utils/compute-aspect-ratio';

export interface StrapiImageProps extends Omit<
  ComponentPropsWithRef<'img'>,
  'src' | 'srcSet' | 'sizes'
> {
  image: StrapiMediaImage;
  formats?: string[];
  transformUrl?: (url: string) => string;
  sizes?: string | {
    [K: `${number}rem`]: string;
    [K: `${number}px`]: string;
    initial?: string;
  };
  desktopFirstSizes?: boolean;
  disableSizesAutoSort?: boolean;
  aspectRatio?: 'intrinsic' | string;
}

export const StrapiImage = memo(function StrapiImage({
  image,
  formats,
  transformUrl,
  sizes,
  desktopFirstSizes,
  disableSizesAutoSort,
  aspectRatio,
  style,
  alt,
  ...props
}: StrapiImageProps) {
  const config = useStrapiImageConfigContext();
  const formatsValue = formats || config.formats;
  const transformUrlValue = transformUrl || config.transformUrl;
  const sizesValue = sizes || config.sizes;
  const desktopFirstSizesValue = typeof desktopFirstSizes === 'boolean'
    ? desktopFirstSizes
    : config.desktopFirstSizes;
  const disableSizesAutoSortValue = typeof disableSizesAutoSort === 'boolean'
    ? disableSizesAutoSort
    : config.disableSizesAutoSort;

  const srcSetAttribute = useMemo<string | undefined>(() => (
    computeSrcSetValue({
      image,
      formats: formatsValue,
      transformUrl: transformUrlValue,
    })
  ), [image, formatsValue, transformUrlValue]);

  const sizesAttribute = useMemo<string | undefined>(() => {
    if (!srcSetAttribute) {
      return undefined;
    }
    return computeSizesValue({
      sizes: sizesValue,
      desktopFirst: desktopFirstSizesValue,
      disableAutoSort: disableSizesAutoSortValue,
    });
  }, [srcSetAttribute, sizesValue, desktopFirstSizesValue, disableSizesAutoSortValue]);

  const alternativeText = useMemo(() => {
    if (typeof alt !== 'undefined') {
      return alt;
    }
    return image.alternativeText || image.caption || image.name || '';
  }, [alt, image]);

  const aspectRatioValue = useMemo(() => (
    computeAspectRatio(image, aspectRatio)
  ), [aspectRatio, image]);
  const styleAttribute = useMemo<CSSProperties | undefined>(() => {
    if (!aspectRatioValue) {
      return style;
    }
    if (typeof style === 'undefined') {
      return { aspectRatio: aspectRatioValue };
    }
    return { ...style, aspectRatio: aspectRatioValue };
  }, [aspectRatioValue, style]);

  const srcAttribute = useMemo(() => transformUrlValue(image.url), [transformUrlValue, image]);

  return (
    <img
      {...props}
      src={srcAttribute}
      srcSet={srcSetAttribute}
      sizes={sizesAttribute}
      alt={alternativeText}
      width={image.width}
      style={styleAttribute}
    />
  );
});
