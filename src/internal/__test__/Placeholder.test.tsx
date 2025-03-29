import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { StrapiImageConfigProvider } from '../../StrapiImageConfigProvider';
import { Placeholder } from '../Placeholder';

const image = {
  width: 2000,
  height: 1125,
  url: 'https://placehold.co/2000x1125',
  alternativeText: 'test image',
  formats: {
    xs: { width: 50, height: 28, url: 'https://placehold.co/50x28' },
    thumbnail: { width: 150, height: 84, url: 'https://placehold.co/150x84' },
    small: { width: 500, height: 281, url: 'https://placehold.co/500x281' },
    medium: { width: 750, height: 422, url: 'https://placehold.co/750x422' },
    large: { width: 1000, height: 563, url: 'https://placehold.co/1000x563' },
  },
};

afterEach(() => {
  cleanup();
});

test('renders <img /> with role="presentation", aria-hidden and alt="" attributes', () => {
  render(<Placeholder isActive image={image} />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveAttribute('aria-hidden');
  expect(placeholder).toHaveAttribute('alt', '');
  expect(placeholder).toHaveAttribute('loading', 'eager');
  expect(placeholder).toHaveAttribute('src');
});

test('has .rsi-placeholder and .rsi-placeholder-img class names by default', () => {
  render(<Placeholder isActive={false} image={image} />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveClass('rsi-placeholder');
  expect(placeholder).toHaveClass('rsi-placeholder-img');
});

test('has .rsi-placeholder-active class when active', () => {
  render(<Placeholder isActive image={image} />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveClass('rsi-placeholder-active');
});

test('accepts className', () => {
  render(<Placeholder isActive image={image} className="foo bar" />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveClass('foo');
  expect(placeholder).toHaveClass('bar');
});

test('uses "thumbnail" format by default', () => {
  render(<Placeholder isActive image={image} />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveAttribute('src', image.formats.thumbnail.url);
});

test('accepts custom format', () => {
  render(<Placeholder isActive image={image} format="xs" />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveAttribute('src', image.formats.xs.url);
});

test('falls back to "thumbnail" format if provided format is missing', () => {
  render(<Placeholder isActive image={image} format="placeholder" />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveAttribute('src', image.formats.thumbnail.url);
});

test('renders nothing if missing provided and "thumbnail" formats', () => {
  const { container } = render((
    <Placeholder
      isActive
      image={{ width: 1000, height: 1000, url: image.url }}
      format="placeholder"
    />
  ));
  expect(container.childNodes.length).toBe(0);
});

test('renders provided content in a wrapper', () => {
  render((
    <Placeholder
      isActive
      image={image}
      content={<span>custom placeholder</span>}
      className="foo"
    />
  ));

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveClass('rsi-placeholder');
  expect(placeholder).toHaveClass('foo');
  expect(placeholder).not.toHaveClass('rsi-placeholder-img');
  expect(placeholder.childNodes.length).toBe(1);
  expect(placeholder.firstChild).toHaveTextContent('custom placeholder');
});

test('renders nothing if provided falsy by defined content', () => {
  [null, 0, false, ''].forEach((content) => {
    const { container } = render((
      <Placeholder
        isActive
        image={image}
        content={content}
      />
    ));
    expect(container.childNodes.length).toBe(0);
  });
});

test('have loading="lazy" attribute when lazy', () => {
  render(<Placeholder isActive image={image} lazy />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveAttribute('loading', 'lazy');
});

test('computes aspectRatio based on image object', () => {
  render(<Placeholder isActive image={image} />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveStyle({ 'aspect-ratio': `${image.width} / ${image.height}` });
});

test('accepts aspectRatio', () => {
  render(<Placeholder isActive image={image} aspectRatio="3 / 4" />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveStyle({ 'aspect-ratio': '3 / 4' });
});

test('set scale to transform style', () => {
  render(<Placeholder isActive image={image} scale=".2" />);

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveStyle({ transform: 'scale(.2)' });
});

test('accepts transformUrl function', () => {
  render((
    <Placeholder
      isActive
      image={image}
      transformUrl={() => 'fixed_url'}
    />
  ));

  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveAttribute('src', 'fixed_url');
});

test('consumes placeholderFormat and transformUrl from StrapiImageConfigProvider', () => {
  const config = {
    placeholderFormat: 'large',
    transformUrl: (url: string) => url.toUpperCase(),
  };
  render((
    <StrapiImageConfigProvider config={config}>
      <Placeholder isActive image={image} />
    </StrapiImageConfigProvider>
  ));
  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveAttribute('src', image.formats.large.url.toUpperCase());
});

test('consumes placeholder from StrapiImageConfigProvider', () => {
  const config = { placeholder: 'custom text' };
  render((
    <StrapiImageConfigProvider config={config}>
      <Placeholder isActive image={image} />
    </StrapiImageConfigProvider>
  ));
  const placeholder = screen.getByRole('presentation', { hidden: true });
  expect(placeholder).toHaveTextContent('custom text');
});
