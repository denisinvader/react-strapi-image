import {
  ComponentPropsWithRef,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cx } from './utils/concat-class-names';
import { StrapiImage, StrapiImageProps } from './StrapiImage';
import { Placeholder } from './Placeholder';
import { useStrapiImageConfigContext } from './StrapiImageConfigContext';
import { computeAspectRatio } from './utils/compute-aspect-ratio';
import { StrapiMediaImage } from './types';

export interface StrapiImageRendererProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children'
> {
  initialLoading?: boolean;
  lazy?: boolean | 'very';
  aspectRatio?: string;

  image: StrapiMediaImage;
  formats?: StrapiImageProps['formats'];
  transformUrl?: StrapiImageProps['transformUrl'];
  sizes?: StrapiImageProps['sizes'];
  desktopFirstSizes?: StrapiImageProps['desktopFirstSizes'];
  disableSizesAutoSort?: StrapiImageProps['disableSizesAutoSort'];
  imageAspectRatio?: string;
  imageClassName?: string;

  placeholder?: ReactNode;
  placeholderFormat?: string;
  placeholderScale?: number | `${number}`;
  placeholderClassName?: string;
  backgroundColor?: string;
}

export const StrapiImageRenderer = memo(function StrapiImageRenderer({
  initialLoading,
  lazy,
  aspectRatio,
  image,
  placeholder,
  placeholderFormat,
  placeholderScale,
  imageAspectRatio,
  imageClassName,
  formats,
  transformUrl,
  sizes,
  desktopFirstSizes,
  disableSizesAutoSort,
  placeholderClassName,
  backgroundColor,
  className,
  style,
  ...props
}: StrapiImageRendererProps) {
  const config = useStrapiImageConfigContext();
  const initialLoadingStatue = typeof initialLoading === 'boolean'
    ? initialLoading
    : config.initialLoading;

  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(initialLoadingStatue);
  const handleImageLoaded = useCallback(() => setIsLoading(false), []);
  useEffect(() => setIsLoading(!imageRef.current || !imageRef.current.complete), []);

  const aspectRatioValue = useMemo(() => (
    computeAspectRatio(image, aspectRatio)
  ), [image, aspectRatio]);

  const classNames = useMemo(() => cx('rsi-root', className), [className]);

  const imageClassNames = useMemo(() => cx(
    'rsi-img',
    isLoading && `rsi-img-loading`,
    imageClassName,
  ), [isLoading, imageClassName]);

  const styleAttribute = useMemo(() => {
    if (!aspectRatioValue && !backgroundColor) {
      return style;
    }
    const result = { ...(style || {}) };
    if (aspectRatioValue && !('aspectRatio' in result)) {
      result.aspectRatio = aspectRatioValue;
    }
    if (backgroundColor) {
      result.backgroundColor = backgroundColor;
    }
    return result;
  }, [aspectRatioValue, backgroundColor, style]);

  return (
    <div
      {...props}
      className={classNames}
      style={styleAttribute}
    >
      <Placeholder
        isActive={isLoading}
        content={placeholder}
        image={image}
        format={placeholderFormat}
        lazy={lazy === 'very'}
        transformUrl={transformUrl}
        scale={placeholderScale}
        aspectRatio={imageAspectRatio || aspectRatioValue}
        className={placeholderClassName}
      />

      <StrapiImage
        ref={imageRef}
        image={image}
        formats={formats}
        transformUrl={transformUrl}
        sizes={sizes}
        desktopFirstSizes={desktopFirstSizes}
        disableSizesAutoSort={disableSizesAutoSort}
        aspectRatio={imageAspectRatio || aspectRatioValue}
        loading={lazy ? 'lazy' : 'eager'}
        className={imageClassNames}
        onLoad={handleImageLoaded}
      />
    </div>
  );
});
