import type { Meta, StoryObj } from '@storybook/react';
import { faker } from '@faker-js/faker';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import { StrapiImage } from '../../';
import { WindowSizeIndicator } from './helpers/WindowSizeIndicator';
import { generateMockImage } from './helpers/generate-mock-image';

const meta: Meta<typeof StrapiImage> = {
  component: StrapiImage,
  title: 'StrapiImage',
};
export default meta;

type Story = StoryObj<typeof StrapiImage>;

faker.seed(123);

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

const blocks: BlocksContent = [
  { type: 'heading', level: 1, children: [{ type: 'text', text: faker.lorem.sentence() }] },
  { type: 'paragraph', children: [{ type: 'text', text: faker.lorem.paragraph() }] },
  {
    type: 'image',
    children: [{ type: 'text', text: '' }],
    image: {
      id: 42,
      name: 'test.jpg',
      hash: 'test.jpg',
      ext: 'jpg',
      mime: 'image/jpg',
      size: 52,
      provider: 'mocks',
      createdAt: '',
      updatedAt: '',
      ...generateMockImage(),
    },
  },
  { type: 'paragraph', children: [{ type: 'text', text: faker.lorem.paragraph() }] },
];

export const InsideBlocksRenderer: Story = {
  args: {
  },
  render: function Render(args) {
    return (
      <BlocksRenderer
        content={blocks}
        blocks={{
          image: ({ image }) => <StrapiImage {...args} image={image} />,
        }}
      />
    );
  },
};
