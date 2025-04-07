import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { StrapiImageConfigProvider } from '../StrapiImageConfigProvider';
import { StrapiImage } from '../StrapiImage';

const image = {
  width: 2000,
  height: 1125,
  url: 'https://placehold.co/2000x1125',
  alternativeText: 'test image',
  formats: {
    thumbnail: { width: 150, height: 84, url: 'https://placehold.co/150x84' },
    small: { width: 500, height: 281, url: 'https://placehold.co/500x281' },
    medium: { width: 750, height: 422, url: 'https://placehold.co/750x422' },
    large: { width: 1000, height: 563, url: 'https://placehold.co/1000x563' },
  },
};

afterEach(() => cleanup());

test('renders <img/> element', () => {
  render(<StrapiImage image={image} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', image.url);
  expect(img).toHaveAttribute('srcSet');
  expect(img).toHaveAttribute('sizes');
  expect(img).toHaveAttribute('width', `${image.width}`);
  expect(img).toHaveStyle({ 'aspect-ratio': `${image.width} / ${image.height}` });
});

test('uses "large", "medium" and "small" formats for srcSet by default', () => {
  render(<StrapiImage image={image} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('srcSet', `${image.url} ${image.width}w, ${image.formats.large.url} ${image.formats.large.width}w, ${image.formats.medium.url} ${image.formats.medium.width}w, ${image.formats.small.url} ${image.formats.small.width}w`);
});

test('selects provided formats for srcSet', () => {
  render(<StrapiImage image={image} formats={['thumbnail', 'small']} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('srcSet', `${image.url} ${image.width}w, ${image.formats.thumbnail.url} ${image.formats.thumbnail.width}w, ${image.formats.small.url} ${image.formats.small.width}w`);
});

test('omits sizes and srcSet attributes if requested formats are missing', () => {
  render(<StrapiImage image={image} formats={['unknown']} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', image.url);
  expect(img).not.toHaveAttribute('srcSet');
  expect(img).not.toHaveAttribute('sizes');
});

test('omits sizes and srcSet attributes if formats are empty', () => {
  render(<StrapiImage image={image} formats={[]} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', image.url);
  expect(img).not.toHaveAttribute('srcSet');
  expect(img).not.toHaveAttribute('sizes');
});

test('applies transformUrl for every format if provided', () => {
  render((
    <StrapiImage
      image={image}
      transformUrl={(url) => {
        const [size] = url.split('/').reverse();
        const [, height] = size.split('x');
        return `http://test.com/${height}.png`;
      }}
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('srcSet', `http://test.com/${image.height}.png ${image.width}w, http://test.com/${image.formats.large.height}.png ${image.formats.large.width}w, http://test.com/${image.formats.medium.height}.png ${image.formats.medium.width}w, http://test.com/${image.formats.small.height}.png ${image.formats.small.width}w`);
});

test('render sizes as "100vw" by default', () => {
  render(<StrapiImage image={image} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', '100vw');
});

test('renders provided sizes string as is', () => {
  render((
    <StrapiImage
      image={image}
      sizes="any string is possible"
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', 'any string is possible');
});

test('renders sizes attribute based on sizes prop object using mobile-firs strategy by default', () => {
  render((
    <StrapiImage
      image={image}
      sizes={{
        initial: '10px',
        '10px': '20px',
        '20px': '30px',
      }}
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', '(min-width: 20px) 30px, (min-width: 10px) 20px, 10px');
});

test('falls back sizes.initial to "100vw" if omitted', () => {
  render((
    <StrapiImage
      image={image}
      sizes={{
        '10rem': '20rem',
        '20rem': '30rem',
      }}
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', '(min-width: 20rem) 30rem, (min-width: 10rem) 20rem, 100vw');
});

test('renders sizes attribute based on sizes prop object using desktop-first strategy if desktopFirstSizes prop is true', () => {
  render((
    <StrapiImage
      image={image}
      sizes={{
        initial: '30px',
        '20px': '20px',
        '10px': '10px',
      }}
      desktopFirstSizes
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', '(max-width: 10px) 10px, (max-width: 20px) 20px, 30px');
});

test('sorts sizes keys as numbers ignoring units', () => {
  render((
    <StrapiImage
      image={image}
      sizes={{
        '2px': '2px',
        '10px': '10px',
        '1rem': '1rem',
        '9rem': '9rem',
      }}
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', '(min-width: 10px) 10px, (min-width: 9rem) 9rem, (min-width: 2px) 2px, (min-width: 1rem) 1rem, 100vw');
});

test('does not sort sizes keys when disableSizesAutoSort is true', () => {
  render((
    <StrapiImage
      image={image}
      sizes={{
        '9rem': '9rem',
        '1rem': '1rem',
        '10px': '10px',
        '2px': '2px',
      }}
      disableSizesAutoSort
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', '(min-width: 9rem) 9rem, (min-width: 1rem) 1rem, (min-width: 10px) 10px, (min-width: 2px) 2px, 100vw');
});

test('computes image aspect ratio when aspectRatio prop equals "intrinsic"', () => {
  render(<StrapiImage image={image} aspectRatio="intrinsic" />);
  const img = screen.getByRole('img');
  expect(img).toHaveStyle({ 'aspect-ratio': `${image.width} / ${image.height}` });
});

test('aspectRatio prop overrides computed computed value', () => {
  render(<StrapiImage image={image} aspectRatio="3 / 4" />);
  const img = screen.getByRole('img');
  expect(img).toHaveStyle({ 'aspect-ratio': '3 / 4' });
});

test('sets image alternativeText to alt attribute', () => {
  render(<StrapiImage image={{ ...image, alternativeText: 'alt-text' }} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('alt', 'alt-text');
});

test('sets image caption to alt attribute if no alternativeText', () => {
  render(<StrapiImage image={{ ...image, alternativeText: null, caption: 'caption-text' }} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('alt', 'caption-text');
});

test('passes alt attribute if defined', () => {
  render((
    <StrapiImage
      image={{ ...image, alternativeText: 'image-internal-alt' }}
      alt="custom-alt-value"
    />
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('alt', 'custom-alt-value');
});

test('consumes formats, transformUrl, sizes and desktopFirstSizes from StrapiImageConfigProvider', () => {
  const config = {
    formats: ['small', 'medium'],
    transformUrl: (url: string) => {
      const [size] = url.split('/').reverse();
      const [, height] = size.split('x');
      return `http://test.com/${height}.png`;
    },
    sizes: {
      initial: '20px',
      '20px': '10px',
    },
    desktopFirstSizes: true,
  };
  render((
    <StrapiImageConfigProvider config={config}>
      <StrapiImage image={image} />
    </StrapiImageConfigProvider>
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', `http://test.com/${image.height}.png`);
  expect(img).toHaveAttribute('srcSet', `http://test.com/${image.height}.png ${image.width}w, http://test.com/${image.formats.small.height}.png ${image.formats.small.width}w, http://test.com/${image.formats.medium.height}.png ${image.formats.medium.width}w`);
  expect(img).toHaveAttribute('sizes', '(max-width: 20px) 10px, 20px');
});

test('consumes disableSizesAutoSort from StrapiImageConfigProvider', () => {
  const config = {
    sizes: {
      '20px': '20px',
      '10px': '10px',
      '30px': '30px',
    },
    desktopFirstSizes: true,
    disableSizesAutoSort: true,
  };
  render((
    <StrapiImageConfigProvider config={config}>
      <StrapiImage image={image} />
    </StrapiImageConfigProvider>
  ));
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('sizes', '(max-width: 20px) 20px, (max-width: 10px) 10px, (max-width: 30px) 30px, 100vw');
});
