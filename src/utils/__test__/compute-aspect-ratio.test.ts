import { expect, test } from 'vitest';
import { computeAspectRatio } from '../compute-aspect-ratio';

test('it returns image.width / image.height string', () => {
  expect(computeAspectRatio({ url: '', width: 16, height: 9 })).toBe('16 / 9');
});

test('it returns image.width / image.height string if fallback is "intrinsic"', () => {
  expect(computeAspectRatio({ url: '', width: 16, height: 9 }, 'intrinsic')).toBe('16 / 9');
});

test('it returns fallback value if its defined and is not "intrinsic"', () => {
  expect(computeAspectRatio({ url: '', width: 16, height: 9 }, '')).toBe('');
  expect(computeAspectRatio({ url: '', width: 16, height: 9 }, 'auto')).toBe('auto');
  expect(computeAspectRatio({ url: '', width: 16, height: 9 }, '9 / 12')).toBe('9 / 12');
});

test('it returns undefined if image.width or image.height lesser or equals zero', () => {
  expect(computeAspectRatio({ url: '', width: 0, height: 0 })).toBe(undefined);
  expect(computeAspectRatio({ url: '', width: 0, height: 100 })).toBe(undefined);
  expect(computeAspectRatio({ url: '', width: 100, height: 0 })).toBe(undefined);
  expect(computeAspectRatio({ url: '', width: -1, height: 100 })).toBe(undefined);
  expect(computeAspectRatio({ url: '', width: 100, height: -50 })).toBe(undefined);
  expect(computeAspectRatio({ url: '', width: -16, height: -9 })).toBe(undefined);
});
