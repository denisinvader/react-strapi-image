import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { StrapiImageConfigProvider } from '../StrapiImageConfigProvider';

afterEach(() => cleanup());

test('renders children', () => {
  render((
    <StrapiImageConfigProvider config={{}}>
      <div data-testid="children">
        provider child
      </div>
    </StrapiImageConfigProvider>
  ));

  const child = screen.getByTestId('children');
  expect(child).toHaveTextContent('provider child');
});
