import { expect, test } from 'vitest';
import { computeSizesValue } from '../compute-sizes-value';

test('returns "100vw" when sizes is undefined', () => {
  const result = computeSizesValue({});

  expect(result).toBe('100vw');
});

test('returns "100vw" when sizes is an empty object', () => {
  const result = computeSizesValue({ sizes: {} });

  expect(result).toBe('100vw');
});

test('supports string values for sizes', () => {
  expect(computeSizesValue({ sizes: '100vw' })).toBe('100vw');
  expect(computeSizesValue({ sizes: '250px' })).toBe('250px');
  expect(computeSizesValue({ sizes: '33vh' })).toBe('33vh');
  expect(computeSizesValue({ sizes: '(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw' }))
    .toBe('(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw');
});

test('builds sizes string using mobile-first strategy by default', () => {
  const result = computeSizesValue({
    sizes: {
      fallback: '16px',
      '20rem': '100px',
      '30rem': '256px',
    },
  });

  expect(result).toBe('(min-width: 30rem) 256px, (min-width: 20rem) 100px, 16px');
});

test('assigns "100vw" as a fallback size when omitted', () => {
  const result = computeSizesValue({
    sizes: {
      '20rem': '100px',
      '30rem': '256px',
    },
  });

  expect(result).toBe('(min-width: 30rem) 256px, (min-width: 20rem) 100px, 100vw');
});

test('sorts sizes automatically by default', () => {
  const expectedValue = '(min-width: 1024px) 1024px, (min-width: 768px) 768px, (min-width: 480px) 480px, 320px';

  const result1 = computeSizesValue({
    sizes: {
      fallback: '320px',
      '480px': '480px',
      '768px': '768px',
      '1024px': '1024px',
    },
  });
  const result2 = computeSizesValue({
    sizes: {
      fallback: '320px',
      '1024px': '1024px',
      '768px': '768px',
      '480px': '480px',
    },
  });
  const result3 = computeSizesValue({
    sizes: {
      '1024px': '1024px',
      fallback: '320px',
      '480px': '480px',
      '768px': '768px',
    },
  });

  expect(result1).toBe(expectedValue);
  expect(result2).toBe(expectedValue);
  expect(result3).toBe(expectedValue);
});

test('respects disableAutoSort option to prevent automatic sorting', () => {
  const result = computeSizesValue({
    disableAutoSort: true,
    sizes: {
      '1024px': '1024px',
      fallback: '320px',
      '56rem': '480px',
      '768px': '768px',
    },
  });

  expect(result).toBe('(min-width: 1024px) 1024px, (min-width: 56rem) 480px, (min-width: 768px) 768px, 320px');
});

test('supports desktop-first strategy when enabled', () => {
  const result = computeSizesValue({
    desktopFirst: true,
    sizes: {
      '768px': '736px',
      '480px': '464px',
      fallback: '1200px',
    },
  });

  expect(result).toBe('(max-width: 480px) 464px, (max-width: 768px) 736px, 1200px');
});

test('sorts sizes automatically when using desktop-first strategy', () => {
  const expectedValue = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1440px';

  const result1 = computeSizesValue({
    desktopFirst: true,
    sizes: {
      fallback: '1440px',
      '480px': '480px',
      '768px': '768px',
      '1024px': '1024px',
    },
  });
  const result2 = computeSizesValue({
    desktopFirst: true,
    sizes: {
      fallback: '1440px',
      '1024px': '1024px',
      '768px': '768px',
      '480px': '480px',
    },
  });
  const result3 = computeSizesValue({
    desktopFirst: true,
    sizes: {
      '1024px': '1024px',
      fallback: '1440px',
      '480px': '480px',
      '768px': '768px',
    },
  });

  expect(result1).toBe(expectedValue);
  expect(result2).toBe(expectedValue);
  expect(result3).toBe(expectedValue);
});
