# React Strapi Image

React components for rendering responsive images provided by [Strapi.](https://strapi.io/)

## Getting started

```sh
npm install react-strapi-image
# or
yarn add react-strapi-image
```

```tsx
import { StrapiImageRenderer } from 'react-strapi-image';

const mockImage = {
  width: 2000,
  height: 1125,
  url: 'https://placehold.co/2000x1125/black/white/jpg',
  alternativeText: null,
  formats: {
    xs: {
      width: 50,
      height: 28,
      url: 'https://placehold.co/50x28/black/white/jpg',
    },
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
    <StrapiImageRenderer
      image={mockImage}
      placeholderFormat="xs"
    />
  );
}
```

> Note: if using Strapi v4, pass image attributes as a value.

## `<StrapiImage />`

Wrapper around the `<img/>` element that dynamically generates `sizes` and `srcSet` attributes for responsive image rendering.

This is a low-level component exported for flexibility, you may find the `<StrapiImageRenderer />` component to be more feature-rich and ready-to-use.

### Example Usage

```tsx
<StrapiImage
  image={response.article.image}
  formats={['xs', 'sm', 'md', 'lg']}
  sizes={{
      initial: '100vw',
      '48rem': '46rem',
      '64rem': '62rem',
      '90rem': '88rem',
  }}
/>
```

### Props

Component extends `ComponentPropsWithRef<'img'>` omitting `src`, `srcSet` and `sizes`, as they are automatically computed.

All props except `image` are optional.

|Name|Type|Description|
|:---|:---|:---|
|`image`|`StrapiMediaImage`|Strapi uploaded image attributes. **Required.**|
|`formats`|`string[]`|List of uploaded image formats to use. Defaults to `['small', 'medium', 'large']` aligning with [the default Strapi responsive images configuration.](https://docs.strapi.io/cms/features/media-library#responsive-images)|
|`transformUrl`|`(url: string) => string`|Function to transform image URL. Defaults to `(url) => url`.|
|`sizes`|``string \| { [K: `${number}rem`]: string; [K: `${number}px`]: string; initial: string }``|Defines image sizes for different screen widths. See details below.|
|`desktopFirstSizes`|`boolean`|Uses desktop-first media queries when generating the `sizes` attribute. Defaults to `false`.|
|`disableSizesAutoSort`|`boolean`|Disables automatic sorting of the `sizes` keys. See details below. Defaults to `false`.|
|`aspectRatio`|`string`|CSS aspect ratio for the image. If set to `'intrinsic'` or left undefined, the ratio is calculated from the `image` object.|

### The Logic of `sizes`

The order of media conditions in the `sizes` attribute is crucial.

> "You may have noticed that the last slot width has no media condition (this is the default that is chosen when none of the media conditions are true). The browser ignores everything after the first matching condition, so be careful how you order the media conditions." — [MDN.](https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images#resolution_switching_different_sizes)

By default, unless `disabledSizesAutoSort` is set to `true`, media conditions in `sizes` attribute are sorted according to either:

* Mobile-first strategy (default).
* Desktop-first strategy (if `desktopFirstSizes` is set to `true`).

If described logic doesn't suit your needs, you can:

* Disable auto-sorting by setting `disabledSizesAutoSort` to `true`, which will preserve the original order of object keys.
* Manually define `sizes` attribute by passing an explicit string value instead of an object.

The `sizes.initial` value is always placed at the end of the list and defaults to `'100vw'` if omitted.

## `<StrapiImageRenderer />`

The `<StrapiImageRenderer />` wraps `<StrapiImage />` and provides a fallback element for enhanced rendering.

This component should be used in most cases when displaying raster images, but also can be used to render images with transparency (e.g., logos or people photos with removed background).

The underlying `<StrapiImage />` component uses `object-fit: cover`, meaning the image may be cropped if certain styles are applied to the wrapper.

### Example Usage

```tsx
import { StrapiImageRenderer } from 'react-strapi-image';
import 'react-strapi-image/css';

const mockImage = {
  width: 1000,
  height: 563,
  url: 'https://placehold.co/1000x563/black/white/jpg',
  alternativeText: null,
  formats: {
    thumbnail: {
      width: 150,
      height: 83,
      url: 'https://placehold.co/150x83/black/white/jpg',
    },
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
  },
};


function App() {
  return (
    <StrapiImageRenderer image={mockImage} />
  );
}
```

In the example above:

* If the image hasn't been cached, a blurred `150x83` image from `thumbnail` format will be shown until the full-resolution image loads.
* If the image is already cached, it will display immediately.

### Props

Component extends `ComponentPropsWithRef<'div'>` omitting `children`.

All props except `image` are optional.

|Name|Type|Description|
|:---|:---|:---|
|`initialLoading`|`boolean`|When `true`, a placeholder is shown before the actual image until it loads. See details below.|
|`lazy`|`boolean \| 'very'`|When `true`, `loading="lazy"` is pllied to `<StrapiImage />`. When `'very'`, the placeholder image also gets `loading="lazy"` (only for default placeholder).|
|`aspectRatio`|`string`|CSS aspect ratio for the **container element.** If set to `'intrinsic'` or left undefined, the ratio is computed from the `image` object. `style.aspectRatio` overrides this prop for container element (but not for the image).|
|`image`|`StrapiMediaImage`|Strapi uploaded image attributes. **Required.**|
|`formats`|`string[]`|List of uploaded image formats to use. Defaults to `['small', 'medium', 'large']` aligning with [the default Strapi responsive images configuration.](https://docs.strapi.io/cms/features/media-library#responsive-images)|
|`transformUrl`|`(url: string) => string`|Function to transform image URL. Defaults to `(url) => url`.|
|`sizes`|``string \| { [K: `${number}rem`]: string; [K: `${number}px`]: string; initial: string }``|Defines image sizes for different screen widths.|
|`desktopFirstSizes`|`boolean`|Uses desktop-first media queries when generating the `sizes` attribute. Defaults to `false`.|
|`disableSizesAutoSort`|`boolean`|Disables automatic sorting of the `sizes` keys. Defaults to `false`.|
|`imageAspectRatio`|`string`|CSS aspect ratio for the image. Defaults to computed value from `aspectRatio`.|
|`imageClassName`|`string`|Passes a `className` to the `<StrapiImage />` component.|
|`placeholder`|`ReactNode`|Custom placeholder (e.g., skeleton on spinner). Pass `null` to disable placeholder completely.|
|`placeholderFormat`|`string`|Strapi image format for the blurred image placeholder. If no value provider or desired format not found in the image object, will try to render `'thumbnail'` format. Only for default placeholder.|
|`placeholderScale`|`number \| string`|Placeholder image scale value. Set value lesser than `1` to render images with transparent background like logos more smoothly. Alternatively use CSS for customization. Only for default placeholder.|
|`placeholderClassName`|`string`|Passes a `className` to the placeholder `<img />` element. Only for default placeholder.|
|`backgroundColor`|`string`|Background color for the container element, for example if you know image's dominant color from [Image Color Palette plugin.](https://github.com/Studio123ca/strapi-plugin-image-color-palette) `style.backgroundColor` overrides this prop.|

> Note: Image Color Palette plugin is mentioned for reference only.

### Styling

`<StrapiImageRenderer />` requires default styles to ensure proper layout. Import them in your project:

```ts
import 'react-strapi-image/css';
```

You can customize these styles using class name selectors or CSS custom properties (CSS variables).

#### List of Classnames

|Name|Description|
|:---|:---|
|`.rsi-root`|Applies to wrapper `<div/>` element.|
|`.rsi-img`|Applies to `<StrapiImage />` component.|
|`.rsi-img-loading`|Applied to `<StrapiImage />` until the `<img />` source loads.|
|`.rsi-placeholder`|For default placeholder, applies to placeholder `<img />` element. For custom placeholders, applies to the placeholder's wrapper element for positioning.|
|`.rsi-placeholder-img`|Applies only to default placeholder `<img />` element.|
|`.rsi-placeholder-active`|Makes the placeholder visible.|

#### CSS Custom Properties

The following CSS custom properties can be redefined at any level, including the `:root` selector.

|Name|Fallback|Description|
|:---|:---|:---|
|`--rsi-transition-duration`|`200ms`|Duration of opacity transition for loaded image.|
|`--rsi-transition-easing`|`ease-out`|Easing function for the opacity transition of the loaded image.|
|`--rsi-placeholder-blur`|`48px`|Blur intensity for the default image placeholder.|
|`--rsi-placeholder-scale`|`1.25`|Scale transform for the default image placeholder.|


### Initial Loading State

Some browsers, such as Firefox and Chrome, may render images with `srcSet` and `sizes` noticeably slower than images using only the `src` attribute on initial page load, causing flickering. This behavior hasn't been observed in Safari.

Setting `initialLoading` to `true` prevents flickering by keeping a placeholder visible until the image fully rendered. However, this introduce a slight delay before the image appears even if it's been cached.

The `initialLoading` prop can be set globally using `<StrapiImageConfigProvider />` component.

<details>
<summary>When JavaScript disabled</summary>

If you enable `initialLoading`, users with JavaScript disabled won't see the actual images, only placeholders. To ensure that images remain visible without JavaScript, add the following `<noscript>` block to your HTML:

```html
<noscript>
  <style>
    .rsi-img {
      opacity: 1 !important;
    }
    .rsi-placeholder {
      display: none;
    }
  </style>
</noscript>
```

</details>

### Placeholder

By default, Strapi's built-in `'thumbnail'` format is used as a placeholder with a blur filter.

Since Strapi's default thumbnail size is 150 pixels wide, you may want to define a smaller dedicated format in [responsive images configuration](https://docs.strapi.io/cms/features/media-library#responsive-images) like in example below and explicitly set this format in `placeholderFormat` prop.

```js
module.exports = ({ env }) => ({
  upload: {
    config: {
      breakpoints: {
        large: 1000,
        medium: 750,
        small: 500,
        // Add smaller image for placeholders
        placeholder: 64,
      },
    },
  },
});
```

The `placeholderFormat` prop can be set globally using `<StrapiImageConfigProvider />` component.

#### Custom Placeholder

If you prefer not to use blurred images as placeholders, you can provide a React node vie the `placeholder` prop, or disable it entirely and use the container's background instead.

You can redefine placeholder globally using `<StrapiImageConfigProvider />` component.

##### Examples of Custom Placeholders

The `initialLoading` prop set just for demonstration and isn't required.

```tsx
import { Flex, Skeleton, Spinner } from '@radix-ui/themes';
import { StrapiImageRenderer } from 'react-strapi-image';
import 'react-strapi-image/css';

// Disable placeholder and use background color
const background = () => (
  <StrapiImageRenderer
    image={image}
    initialLoading
    placeholder={null}
    backgroundColor="#0D74CE"
  />
);

// Use a skeleton placeholder
const skeleton = () => (
  <StrapiImageRenderer
    image={image}
    initialLoading
    placeholder={<Skeleton width="100%" height="100%" />}
  />
);

// Use a centered spinner
const spinner = () => (
  <StrapiImageRenderer
    image={image}
    initialLoading
    placeholder={(
      <Flex align="center" justify="center" width="100%" height="100%">
        <Spinner size="3" />
      </Flex>
    )}
  />
);
```


### `<StrapiImageConfigProvider />`

`<StrapiImageConfigProvider />` allows you to set some default props for `<StrapiImage />` and `<StrapiImageRenderer />` components.

Explicit props values (except `undefined`) on individual components will override provider vlaues.

#### Example Usage

```tsx
import {
  StrapiImage,
  StrapiImageConfig,
  StrapiImageConfigProvider,
} from 'react-strapi-image';

const strapiImageConfig: StrapiImageConfig = {
  formats: ['xs', 'sm', 'md'],
  sizes: {
    '520px': '50vw',
    '768px': '222px',
    '1024px': '285px',
    '1280px': '370px',
  },
};

export function App() {
  return (
    <StrapiImageConfigProvider config={strapiImageConfig}>
      <StrapiImage image={image1} />
      {/* Overrides the `sizes` value from the provider */}
      <StrapiImage image={image2} sizes="100vw" />
    </StrapiImageConfigProvider>
  );
}
```

> **Note:** since this component uses a standard React Context, the `config` prop **should be defined outside of React components or memoized** to avoid unnecessary re-renders.

#### `config` Prop Type Definition:

```ts
export interface StrapiImageConfig {
  formats?: string[];
  transformUrl?: (url: string) => string;
  sizes?: string | {
    [K: `${number}rem`]: string;
    [K: `${number}px`]: string;
    initial?: string;
  };
  desktopFirstSizes?: boolean;
  disableSizesAutoSort?: boolean;
  placeholder?: ReactNode;
  placeholderFormat?: string;
  initialLoading?: boolean;
}
```
