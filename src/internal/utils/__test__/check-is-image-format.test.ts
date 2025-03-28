import { expect, test } from 'vitest';
import { checkIsImageFormat } from '../check-is-image-format';

test('returns true for objects containing required fields', () => {
  expect(checkIsImageFormat({ url: '/my-image.png', width: 220, height: 220 })).toBe(true);
  expect(checkIsImageFormat({ url: 'https://mdn.io/some-image.jpg', width: 124, height: 90 })).toBe(true);
  expect(checkIsImageFormat({ url: '', width: 0, height: 0 })).toBe(true);
  expect(checkIsImageFormat({ url: '', width: -9, height: -8 })).toBe(true);
});

test('returns false for objects missing one of required fields', () => {
  expect(checkIsImageFormat({ width: 220, height: 220 })).toBe(false);
  expect(checkIsImageFormat({ url: '/my-image.png', height: 220 })).toBe(false);
  expect(checkIsImageFormat({ url: '', width: -9 })).toBe(false);
  expect(checkIsImageFormat({ width: -9 })).toBe(false);
  expect(checkIsImageFormat({})).toBe(false);
});

test('returns false for non-objects', () => {
  expect(checkIsImageFormat('{ url: "", width: 220, height: 220 }')).toBe(false);
  expect(checkIsImageFormat(null)).toBe(false);
  expect(checkIsImageFormat(undefined)).toBe(false);
  expect(checkIsImageFormat(242)).toBe(false);
  expect(checkIsImageFormat(new Set())).toBe(false);
  expect(checkIsImageFormat([])).toBe(false);
});
