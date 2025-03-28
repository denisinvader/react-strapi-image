import { createContext, useContext } from 'react';
import { StrapiImageConfig } from '../types';

type NotRequiredConfigFields = 'sizes' | 'placeholder';

export type ConfigContextValue = (
  & Omit<Required<StrapiImageConfig>, NotRequiredConfigFields>
  & Pick<StrapiImageConfig, NotRequiredConfigFields>
);

export const defaultConfigValue: ConfigContextValue = {
  formats: ['large', 'medium', 'small'],
  transformUrl: (url) => url,
  desktopFirstSizes: false,
  disableSizesAutoSort: false,
  placeholderFormat: 'thumbnail',
  initialLoading: false,
};

export const ConfigContext = createContext<ConfigContextValue>(defaultConfigValue);

export const useConfigContext = () => useContext(ConfigContext);
