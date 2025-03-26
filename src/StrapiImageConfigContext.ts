import { createContext, useContext } from 'react';
import type { StrapiImageConfig } from './types';

export type StrapiImageConfigContextValue = (
  & Omit<Required<StrapiImageConfig>, 'sizes'>
  & Pick<StrapiImageConfig, 'sizes'>
);

export const defaultConfigValue: StrapiImageConfigContextValue = {
  formats: ['large', 'medium', 'small'],
  transformUrl: (url) => url,
  desktopFirstSizes: false,
  disableSizesAutoSort: false,
};

export const StrapiImageConfigContext = createContext<StrapiImageConfigContextValue>(defaultConfigValue);

export const useStrapiImageConfigContext = () => useContext(StrapiImageConfigContext);
