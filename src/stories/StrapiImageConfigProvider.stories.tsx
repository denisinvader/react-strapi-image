import type { Meta, StoryObj } from '@storybook/react';
import { faker } from '@faker-js/faker';
import { Container, Grid, Card, Inset, Text } from '@radix-ui/themes';
import { StrapiImage, StrapiImageConfigProvider } from '../';
import { generateMockImage } from './helpers/generate-mock-image';
import { imageColors } from './helpers/image-colors';

const meta: Meta<typeof StrapiImageConfigProvider> = {
  component: StrapiImageConfigProvider,
  title: 'StrapiImageConfigProvider',
};
export default meta;

type Story = StoryObj<typeof StrapiImageConfigProvider>;

faker.seed(42);

const mockImage = generateMockImage();

export const Playground: Story = {
  args: {
    config: {
      formats: ['small', 'medium'],
      sizes: '50vw',
    },
    children: (
      <StrapiImage image={mockImage} />
    ),
  },
};

const images = Array.from({ length: 8 }).map((_, id) => ({
  id,
  caption: faker.lorem.sentence(),
  ...generateMockImage({
    background: imageColors[faker.number.int({ min: 0, max: imageColors.length - 1 })],
    formats: {
      xs: 520,
      sm: 768,
      md: 1024,
    },
  }),
}));

export const GridStory: Story = {
  args: {
    config: {
      formats: ['xs', 'sm', 'md', 'lg', 'xl'],
      sizes: {
        fallback: '100vw',
        '520px': '50vw',
        '768px': '221.33px',
        '1024px': '285.33px',
        '1280px': '370px',
      },
    },
    children: (
      <Container size={{ initial: '2', md: '3', lg: '4' }}>
        <Grid
          gap="3"
          columns={{ initial: '1', xs: '2', sm: '3' }}
        >
          {images.map((image) => (
            <Card key={image.id} size="2">
              <Inset clip="padding-box" side="top" pb="current">
                <StrapiImage
                  image={image}
                />
              </Inset>
              <Text as="p" size="3">
                {image.caption}
              </Text>
            </Card>
          ))}
        </Grid>
      </Container>
    ),
  },
};
