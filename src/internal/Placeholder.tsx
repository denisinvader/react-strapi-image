import { ReactNode, memo, useMemo } from 'react';
import { StrapiMediaImage } from '../types';
import { checkIsImageFormat } from './utils/check-is-image-format';
import { computeAspectRatio } from './utils/compute-aspect-ratio';
import { cx } from './utils/concat-class-names';
import { useConfigContext } from './ConfigContext';

export interface PlaceholderProps {
  isActive: boolean;
  image: StrapiMediaImage;
  lazy?: boolean;
  format?: string;
  content?: ReactNode;
  scale?: number | `${number}`;
  aspectRatio?: string;
  transformUrl?: (url: string) => string;
  className?: string;
}

export const Placeholder = memo(function Placeholder({
  isActive,
  image,
  lazy,
  format,
  content,
  scale,
  aspectRatio,
  transformUrl,
  className,
}: PlaceholderProps) {
  const config = useConfigContext();
  const children = typeof content !== 'undefined' ? content : config.placeholder;
  const formatValue = format || config.placeholderFormat;
  const transformUrlValue = transformUrl || config.transformUrl;

  const src = useMemo(() => {
    if (typeof children !== 'undefined' || !image.formats) {
      return '';
    }
    if (formatValue && checkIsImageFormat(image.formats[formatValue])) {
      return transformUrlValue(image.formats[formatValue].url);
    }
    if (checkIsImageFormat(image.formats.thumbnail)) {
      return transformUrlValue(image.formats.thumbnail.url);
    }
    return '';
  }, [children, image, formatValue, transformUrlValue]);

  const aspectRatioValue = useMemo(() => {
    if (typeof children !== 'undefined') {
      return undefined;
    }
    return computeAspectRatio(image, aspectRatio);
  }, [image, aspectRatio, children]);

  const classNames = useMemo(() => cx(
    'rsi-placeholder',
    isActive && 'rsi-placeholder-active',
    (typeof children === 'undefined') && 'rsi-placeholder-img',
    className,
  ), [isActive, className, children]);

  if (typeof children === 'undefined') {
    if (!src) {
      return null;
    }

    return (
      <img
        role="presentation"
        aria-hidden="true"
        alt=""
        src={src}
        loading={lazy ? 'lazy' : 'eager'}
        className={classNames}
        style={{
          aspectRatio: aspectRatioValue,
          transform: typeof scale !== 'undefined' ? `scale(${scale})` : undefined,
        }}
      />
    );
  }

  if (!children) {
    return null;
  }

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={classNames}
    >
      {children}
    </div>
  );
});
