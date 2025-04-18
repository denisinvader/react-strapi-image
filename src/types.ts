import type { ReactNode } from 'react';

interface StrapiMediaImageFile {
  name?: string;
  hash?: string;
  ext?: string;
  mime?: string;
  width: number;
  height: number;
  size?: number;
  url: string;
}

export interface StrapiMediaImageFormat extends StrapiMediaImageFile {
  path?: unknown;
  sizeInBytes?: number;
}

export interface StrapiMediaImage<F = unknown> extends StrapiMediaImageFile {
  id?: number;
  documentId?: string;
  publishedAt?: string;
  alternativeText?: string | null;
  caption?: string | null;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: unknown;
  createdAt?: string;
  updatedAt?: string;
  formats?: Record<string, F>;
}

export interface StrapiImageConfig {
  formats?: string[];
  transformUrl?: (url: string) => string;
  sizes?: string | {
    [K: `${number}rem`]: string;
    [K: `${number}px`]: string;
    initial?: string;
  };
  desktopFirstSizes?: boolean;
  disableSizesAutoSort?: boolean;
  placeholder?: ReactNode;
  placeholderFormat?: string;
  initialLoading?: boolean;
}
