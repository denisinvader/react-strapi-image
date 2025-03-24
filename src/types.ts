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

interface StrapiMediaImageFormat extends StrapiMediaImageFile {
  path?: unknown;
  sizeInBytes?: number;
}

export interface StrapiMediaImage extends StrapiMediaImageFile {
  id?: number;
  documentId?: string;
  publishedAt?: string;
  alternativeText: string | null;
  caption?: string | null;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: unknown;
  createdAt?: string;
  updatedAt?: string;
  formats?: Record<string, StrapiMediaImageFormat | undefined>;
}
