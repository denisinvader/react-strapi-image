import { ReactNode, memo, useMemo } from 'react';
import type { StrapiImageConfig } from './types';
import { StrapiImageConfigContext, defaultConfigValue } from './StrapiImageConfigContext';

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
    <StrapiImageConfigContext.Provider value={value}>
      {children}
    </StrapiImageConfigContext.Provider>
  );
});
