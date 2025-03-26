import type { Meta, StoryObj } from '@storybook/react';
import { StrapiImage } from '../';
import { WindowSizeIndicator } from './helpers/WindowSizeIndicator';
import { generateMockImage } from './helpers/generate-mock-image';

const meta: Meta<typeof StrapiImage> = {
  component: StrapiImage,
  title: 'StrapiImage',
};
export default meta;

type Story = StoryObj<typeof StrapiImage>;

export const Playground: Story = {
  decorators: [(Story) => <WindowSizeIndicator><Story /></WindowSizeIndicator>],
  args: {
    image: generateMockImage({ width: 2000, height: 1125 }),
    formats: ['small', 'medium', 'large'],
    sizes: {
      initial: '100vw',
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
