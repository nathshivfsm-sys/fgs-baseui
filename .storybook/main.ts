import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { storybookAliases } from './aliases';

const workspaceRoot = fileURLToPath(new URL('../', import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../libs/ui/src/**/*.stories.@(ts|tsx)',
    '../apps/*/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: storybookAliases(workspaceRoot),
      },
    });
  },
};

export default config;
