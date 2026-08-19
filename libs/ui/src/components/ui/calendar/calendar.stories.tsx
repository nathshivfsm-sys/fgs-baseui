import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './calendar';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { defaultMonth: new Date(2025, 0, 1) },
  argTypes: {
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
    },
  },
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { mode: 'single', selected: new Date(2025, 0, 15) },
};

export const Range: Story = {
  args: {
    mode: 'range',
    selected: { from: new Date(2025, 0, 8), to: new Date(2025, 0, 14) },
  },
};

/** Month and year dropdowns replace the static caption. */
export const WithDropdowns: Story = {
  args: {
    mode: 'single',
    captionLayout: 'dropdown',
    startMonth: new Date(2024, 0),
    endMonth: new Date(2026, 11),
  },
};

export const WithWeekNumbers: Story = {
  args: { mode: 'single', showWeekNumber: true },
};

/** Navigation buttons follow the `buttonVariant` prop. */
export const OutlineNavigation: Story = {
  args: { mode: 'single', buttonVariant: 'outline' },
};
