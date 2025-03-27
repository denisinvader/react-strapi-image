import { expect, test } from 'vitest';
import { cx } from '../concat-class-names';

test('concat strings using spaces', () => {
  expect(cx('foo', 'bar')).toBe('foo bar');
  expect(cx('foo', '42', 'bar')).toBe('foo 42 bar');
  expect(cx('foo')).toBe('foo');
});

test('ignores empty strings', () => {
  expect(cx('foo', '', 'bar', '', 'baz')).toBe('foo bar baz');
});

test('ignores non-string values', () => {
  expect(cx('foo', true, false, undefined, null, 'bar')).toBe('foo bar');
});
