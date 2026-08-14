import type { Meta, StoryObj } from '@storybook/react-vite';
import { Callout } from './callout';

const meta = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  args: {
    children:
      'Total service price is the sum of material, labor, equipment, and other charges.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
} satisfies Meta<typeof Callout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { variant: 'success', title: 'Saved' } };
export const Warning: Story = {
  args: { variant: 'warning', title: 'Review required' },
};
export const Error: Story = {
  args: { variant: 'error', title: 'Unable to calculate price' },
};
export const WithIcon: Story = {
  args: { icon: <span aria-hidden="true">i</span>, title: 'Pricing guidance' },
};
