import { createContext, useContext } from 'react';
import type { StrapiImageConfig } from './types';

type NotRequiredConfigFields = 'sizes' | 'placeholder';

export type StrapiImageConfigContextValue = (
  & Omit<Required<StrapiImageConfig>, NotRequiredConfigFields>
  & Pick<StrapiImageConfig, NotRequiredConfigFields>
);

export const defaultConfigValue: StrapiImageConfigContextValue = {
  formats: ['large', 'medium', 'small'],
  transformUrl: (url) => url,
  desktopFirstSizes: false,
  disableSizesAutoSort: false,
  placeholderFormat: 'thumbnail',
  initialLoading: false,
};

export const StrapiImageConfigContext = createContext<StrapiImageConfigContextValue>(defaultConfigValue);

export const useStrapiImageConfigContext = () => useContext(StrapiImageConfigContext);
