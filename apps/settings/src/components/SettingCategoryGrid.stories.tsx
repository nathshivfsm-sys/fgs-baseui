import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { allSettings } from '../constants/settings';
import { SettingCategoryGrid } from './SettingCategoryGrid';

const meta = {
  title: 'Settings/SettingCategoryGrid',
  component: SettingCategoryGrid,
  tags: ['autodocs'],
  args: { categories: allSettings.company },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SettingCategoryGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: /^General Info/ }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: /^Postal Codes/ }),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  args: { categories: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};
