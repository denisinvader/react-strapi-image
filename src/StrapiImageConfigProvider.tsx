import { ReactNode, memo, useMemo } from 'react';
import { StrapiImageConfig } from './types';
import { ConfigContext, defaultConfigValue } from './internal/ConfigContext';

export interface StrapiImageConfigProviderProps {
  config: StrapiImageConfig;
  children: ReactNode;
}

export const StrapiImageConfigProvider = memo(function StrapiImageConfigProvider({
  config,
  children,
}: StrapiImageConfigProviderProps) {
  const value = useMemo(() => ({
    ...defaultConfigValue,
    ...config,
  }), [config]);

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
});
