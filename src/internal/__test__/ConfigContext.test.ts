import { useContext } from 'react';
import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ConfigContext } from '../ConfigContext';

test('provides default values', () => {
  const context = renderHook(() => useContext(ConfigContext));
  const config = context.result.current;

  expect(config.formats).toEqual(['large', 'medium', 'small']);
  expect(config.transformUrl('input value')).toBe('input value');
  expect(config.sizes).toBe(undefined);
  expect(config.desktopFirstSizes).toBe(false);
  expect(config.disableSizesAutoSort).toBe(false);
  expect(config.placeholder).toBe(undefined);
  expect(config.placeholderFormat).toBe('thumbnail');
  expect(config.initialLoading).toBe(false);
});
