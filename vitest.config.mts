import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'query',
          environment: 'node',
          include: ['tools/integration/src/query-runtime.integration.test.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        optimizeDeps: {
          include: [
            '@tanstack/react-query',
            'zustand',
            'zustand/vanilla',
            // dispatch-board spike (libs/ui/src/spike) — pre-bundle so the
            // optimizer does not reload mid-run and fail the story tests
            '@fullcalendar/react',
            '@fullcalendar/react/interaction',
            '@fullcalendar/react/themes/monarch',
            '@fullcalendar/react-scheduler/resource-timeline',
            'temporal-polyfill/global',
          ],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
