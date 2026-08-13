import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    mode: {
      description: 'Color mode',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle(
        'dark',
        context.globals.mode === 'dark',
      );
      return createElement(Story);
    },
  ],
  parameters: {
    a11y: { test: 'error' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: { order: ['Components', 'Features'] },
    },
  },
};

export default preview;
