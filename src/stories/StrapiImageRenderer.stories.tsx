import type { Meta, StoryObj } from '@storybook/react';
import { Flex, Skeleton, Spinner } from '@radix-ui/themes';
import { StrapiImageRenderer } from '../';
import { generateMockImage } from './helpers/generate-mock-image';

const meta: Meta<typeof StrapiImageRenderer> = {
  component: StrapiImageRenderer,
  title: 'StrapiImageRenderer',
};
export default meta;

type Story = StoryObj<typeof StrapiImageRenderer>;

export const Default: Story = {
  args: {
    image: generateMockImage({
      width: 4200,
      height: 1800,
      formats: { placeholder: 32, small: 500, medium: 750, large: 1000 },
    }),
    initialLoading: false,
    placeholderFormat: 'placeholder',
  },
};

export const SkeletonPlaceholder: Story = {
  args: {
    image: generateMockImage({
      width: 4200,
      height: 1800,
      formats: { placeholder: 32, small: 500, medium: 750, large: 1000 },
    }),
    initialLoading: false,
    placeholder: <Skeleton width="100%" height="100%" />,
  },
};

export const SpinnerPlaceholder: Story = {
  args: {
    image: generateMockImage({
      width: 4200,
      height: 1800,
      formats: { placeholder: 32, small: 500, medium: 750, large: 1000 },
    }),
    initialLoading: false,
    placeholder: (
      <Flex align="center" justify="center" width="100%" height="100%">
        <Spinner size="3" />
      </Flex>
    ),
  },
};

export const BackgroundPlaceholder: Story = {
  args: {
    image: generateMockImage({
      width: 4200,
      height: 1800,
      formats: { placeholder: 32, small: 500, medium: 750, large: 1000 },
    }),
    initialLoading: false,
    placeholder: null,
    backgroundColor: '#004141',
  },
};
