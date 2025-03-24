import type { Meta, StoryObj } from '@storybook/react';
import { StrapiImage } from '../StrapiImage';
import { WindowSizeIndicator } from './helpers/WindowSizeIndicator';

const meta: Meta<typeof StrapiImage> = {
  component: StrapiImage,
  title: 'StrapiImage',
};
export default meta;

type Story = StoryObj<typeof StrapiImage>;

export const Playground: Story = {
  decorators: [(Story) => <WindowSizeIndicator><Story /></WindowSizeIndicator>],
  args: {
    image: {
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
    },
    formats: ['small', 'medium', 'large'],
    sizes: {
      fallback: '100vw',
      '500px': '750px',
      '750px': '1000px',
      '1000px': '100vw',
    },
  },
};

export const StringSizes: Story = {
  decorators: [(Story) => <WindowSizeIndicator><Story /></WindowSizeIndicator>],
  args: {
    ...Playground.args,
    sizes: 'calc(100vw - 2rem)',
  },
};
