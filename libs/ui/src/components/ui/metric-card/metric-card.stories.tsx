import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlertTriangleIcon,
  LocationPinIcon,
  LockIcon,
  OrganizationIcon,
  TrendingUpIcon,
} from '../../../icons';
import { MetricCard } from './metric-card';

const icon = <LocationPinIcon />;
const meta = {
  title: 'Components/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  args: {
    description: 'Across all business units',
    icon,
    label: 'Total Locations',
    value: 48,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['blue', 'green', 'orange', 'purple', 'neutral'],
    },
    descriptionTone: {
      control: 'select',
      options: ['default', 'positive', 'negative'],
    },
  },
} satisfies Meta<typeof MetricCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { className: 'w-[229px]' } };
export const AllTones: Story = {
  render: (args) => {
    const cards = [
      {
        description: 'Across all business units',
        icon: <LocationPinIcon />,
        label: 'Total Locations',
        tone: 'blue' as const,
        value: 48,
      },
      {
        description: '87.5% of total',
        icon: <LockIcon />,
        label: 'Active Locations',
        tone: 'green' as const,
        value: 42,
      },
      {
        description: 'Require attention',
        icon: <AlertTriangleIcon />,
        label: 'Inactive Locations',
        tone: 'orange' as const,
        value: 6,
      },
      {
        description: '↑ 14% vs last month',
        icon: <TrendingUpIcon />,
        label: 'New This Month',
        tone: 'purple' as const,
        value: 8,
      },
      {
        description: 'Organizational groups',
        icon: <OrganizationIcon />,
        label: 'Business Units',
        tone: 'neutral' as const,
        value: 5,
      },
    ];

    return (
      <div className="grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-2">
        {cards.map((card) => (
          <MetricCard {...args} {...card} key={card.tone} />
        ))}
      </div>
    );
  },
};
export const PositiveDescription: Story = {
  args: {
    description: '↑ 14% vs last month',
    descriptionTone: 'positive',
    icon: <TrendingUpIcon />,
    label: 'New This Month',
    tone: 'purple',
    value: 8,
  },
};
export const NegativeDescription: Story = {
  args: {
    description: 'Requires attention',
    descriptionTone: 'negative',
    icon: <AlertTriangleIcon />,
    label: 'Inactive Locations',
    tone: 'orange',
    value: 6,
  },
};
export const WithoutIcon: Story = {
  args: { icon: undefined, label: 'Open requests', value: 12 },
};
export const Loading: Story = { args: { loading: true } };
export const LongContent: Story = {
  args: {
    description: 'Across every business unit and operational region',
    label: 'Locations requiring scheduled maintenance',
    value: '1,248',
  },
};
