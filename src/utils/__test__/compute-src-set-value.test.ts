import { expect, test } from 'vitest';
import { computeSrcSetValue } from '../compute-src-set-value';

test('returns undefined if image has no formats', () => {
  const result = computeSrcSetValue({
    image: {
      alternativeText: null,
      width: 16,
      height: 9,
      url: 'https://test.com/image.png',
    },
  });

  expect(result).toBe(undefined);
});

test('returns undefined if formats is undefined', () => {
  const result = computeSrcSetValue({
    image: {
      alternativeText: null,
      width: 3200,
      height: 1800,
      url: 'https://test.com/image.png',
      formats: {
        small: { width: 16, height: 9, url: 'https://test.com/image-small.png' },
        medium: { width: 160, height: 90, url: 'https://test.com/image-medium.png' },
        large: { width: 1600, height: 900, url: 'https://test.com/image-large.png' },
      },
    },
  });

  expect(result).toBe(undefined);
});

test('returns combined srcSet for image and requested formats and original image', () => {
  const result = computeSrcSetValue({
    formats: ['small', 'medium', 'large'],
    image: {
      alternativeText: null,
      width: 3200,
      height: 1800,
      url: 'https://test.com/image.png',
      formats: {
        small: { width: 16, height: 9, url: 'https://test.com/image-small.png' },
        medium: { width: 160, height: 90, url: 'https://test.com/image-medium.png' },
        large: { width: 1600, height: 900, url: 'https://test.com/image-large.png' },
      },
    },
  });

  expect(result).toBe('https://test.com/image.png 3200w, https://test.com/image-small.png 16w, https://test.com/image-medium.png 160w, https://test.com/image-large.png 1600w');
});

test('ignores not requested formats', () => {
  const result = computeSrcSetValue({
    formats: ['sm', 'xs'],
    image: {
      alternativeText: null,
      width: 3200,
      height: 1800,
      url: 'https://test.com/image.png',
      formats: {
        small: { width: 16, height: 9, url: 'https://test.com/image-small.png' },
        xs: { width: 32, height: 18, url: 'https://test.com/image-xs.png' },
        sm: { width: 64, height: 36, url: 'https://test.com/image-sm.png' },
        medium: { width: 160, height: 90, url: 'https://test.com/image-medium.png' },
        large: { width: 1600, height: 900, url: 'https://test.com/image-large.png' },
      },
    },
  });

  expect(result).toBe('https://test.com/image.png 3200w, https://test.com/image-sm.png 64w, https://test.com/image-xs.png 32w');
});

test('supports url transformation', () => {
  const result = computeSrcSetValue({
    formats: ['medium', 'small'],
    image: {
      alternativeText: null,
      width: 3200,
      height: 1800,
      url: '/image.png',
      formats: {
        small: { width: 16, height: 9, url: '/image-small.png' },
        medium: { width: 160, height: 90, url: '/image-medium.png' },
      },
    },
    transformUrl: (url) => `http://localhost${url}`,
  });

  expect(result).toBe('http://localhost/image.png 3200w, http://localhost/image-medium.png 160w, http://localhost/image-small.png 16w');
});
