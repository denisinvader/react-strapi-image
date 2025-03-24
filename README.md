# React Strapi Image

React components for rendering responsive images from [Strapi.](https://strapi.io/)

## Getting started

```sh
npm install react-strapi-image
# or
yarn add react-strapi-image
```

```tsx
import { StrapiImage } from 'react-strapi-image';

const mockImage = {
  width: 2000,
  height: 1125,
  url: 'https://placehold.co/2000x1125/black/white/jpg',
  alternativeText: null,
  formats: {
    small: {
      width: 500,
      height: 281,
      url: 'https://placehold.co/500x281/black/white/jpg',
    },
    medium: {
      width: 750,
      height: 422,
      url: 'https://placehold.co/750x422/black/white/jpg',
    },
    large: {
      width: 1000,
      height: 563,
      url: 'https://placehold.co/1000x563/black/white/jpg',
    },
  },
};

export function App() {
  return (
    <StrapiImage image={mockImage} />
  );
}
```

> When using Strapi v4 provide image attributes as value.

## Components

### `<StrapiImage />`

Wrapper component around HTML `<img/>` element that calculates `sizes` and `srcSet` attributes to ensure responsive image rendering.

It also sets the image's aspect ratio to minimize Cumulative Layout Shift.

Example usage:

```tsx
<StrapiImage
  image={response.article.image}
  formats={['xs', 'sm', 'md', 'lg']}
  sizes={{
      fallback: '100vw',
      '48rem': '46rem',
      '64rem': '62rem',
      '90rem': '88rem',
  }}
/>
```

#### Props

Component extends `ComponentPropsWithRef<'img'>` omitting `src`, `srcSet` and `sizes` attributes, as they are automatically computed based on the component’s own props.

|Name|Type|Description|
|---|---|---|
|`image`|`StrapiMediaImage`|Strapi uploaded image attributes. **Required.**|
|`formats`|`string[]`|List of uploaded image formats to use. Defaults to `['small', 'medium', 'large']` aligning with the [default Strapi Upload plugin configuration.](https://docs.strapi.io/dev-docs/plugins/upload/#responsive-images)|
|`transformUrl`|`(url: string) => string`|Function to transform image URL. Defaults to `(url) => url`.|
|`sizes`|``string \| { [K: `${number}rem`]: string; [K: `${number}px`]: string; fallback: string }``|Defines image sizes for different screen widths. See detailed information below.|
|`desktopFirstSizes`|`boolean`|Uses desktop-first media queries when generating the `sizes` attribute. Defaults to `false`.|
|`disableSizesAutoSort`|`boolean`|Disables automatic sorting of the `sizes` keys. See more details below. Defaults to `false`.|
|`aspectRatio`|`'intrinsic' \| string`|CSS aspect ratio for the image. If set to `'intrinsic'`, the ratio is computed from the `image` object. Defaults to `'intrinsic'`.|

#### `sizes` Computing Logic

The order of media conditions in the `sizes` attribute is crucial.

> You may have noticed that the last slot width has no media condition (this is the default that is chosen when none of the media conditions are true). The browser ignores everything after the first matching condition, so be careful how you order the media conditions. Source: [MDN.](https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images#resolution_switching_different_sizes)

By default, unless you explicitly set `disabledSizesAutoSort` property, media conditions in resulting `sizes` attribute are sorted according to either:

* Mobile-first strategy (default).
* Desktop-first strategy (if `desktopFirstSizes` is set to `true`).

The `sizes.fallback` value always placed at the end of the list and defaults to `'100vw'` if omitted.

If described logic doesn't suit your needs, you can:

* Disable auto-sorting by setting `disabledSizesAutoSort` to `true`, which will preserve the original order of object keys.
* Manually define `sizes` attribute by passing an explicit string value instead of an object.
