import React from 'react';
import type { Preview } from '@storybook/react';
import { css } from '@emotion/css';

const globalStyles = css({
  '& img': {
    maxInlineSize: '100%',
  },
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={globalStyles}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
