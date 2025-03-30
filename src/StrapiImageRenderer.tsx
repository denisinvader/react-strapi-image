import {
  ComponentPropsWithRef,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StrapiMediaImage } from './types';
import { computeAspectRatio } from './internal/utils/compute-aspect-ratio';
import { cx } from './internal/utils/concat-class-names';
import { useConfigContext } from './internal/ConfigContext';
import { Placeholder } from './internal/Placeholder';
import { StrapiImage, StrapiImageProps } from './StrapiImage';

export interface StrapiImageRendererProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
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

export const StrapiImageRenderer = memo(forwardRef<HTMLDivElement, StrapiImageRendererProps>(function StrapiImageRenderer({
  initialLoading,
  lazy,
  aspectRatio,
  image,
  formats,
  transformUrl,
  sizes,
  desktopFirstSizes,
  disableSizesAutoSort,
  imageAspectRatio,
  imageClassName,
  placeholder,
  placeholderFormat,
  placeholderScale,
  placeholderClassName,
  backgroundColor,
  className,
  style,
  ...props
}, ref) {
  const config = useConfigContext();
  const initialLoadingStatue = typeof initialLoading === 'boolean'
    ? initialLoading
    : config.initialLoading;

  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(initialLoadingStatue);
  const handleImageLoaded = useCallback(() => setIsLoading(false), []);
  useEffect(() => {
    if (imageRef.current) {
      setIsLoading(!imageRef.current.complete);
    }
  }, []);

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
      ref={ref}
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
}));
StrapiImageRenderer.displayName = 'StrapiImageRenderer';
