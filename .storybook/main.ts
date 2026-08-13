import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

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
        alias: {
          '@cms/ui': path.join(workspaceRoot, 'libs/ui/src/index.ts'),
          '@cms/platform-contract': path.join(
            workspaceRoot,
            'libs/platform-contract/src/index.ts',
          ),
        },
      },
    });
  },
};

export default config;
