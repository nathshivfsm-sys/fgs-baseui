import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Commercial' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'] },
    variant: { control: 'inline-radio', options: ['soft', 'solid', 'outline'] },
    tone: {
      control: 'select',
      options: [
        'neutral',
        'action',
        'success',
        'warning',
        'destructive',
        'info',
      ],
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const tones = [
  'neutral',
  'action',
  'success',
  'warning',
  'destructive',
  'info',
] as const;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <div className="flex flex-wrap items-center gap-2" key={variant}>
          {tones.map((tone) => (
            <Badge {...args} key={tone} tone={tone} variant={variant}>
              {tone}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Status pills from the Service Location detail screens. */
export const StatusPills: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" tone="warning">
        VIP
      </Badge>
      <Badge dot size="sm" tone="action">
        Commercial
      </Badge>
      <Badge dot size="sm" tone="neutral">
        Maintenance
      </Badge>
      <Badge size="sm" tone="info">
        Net 30
      </Badge>
      <Badge size="sm" tone="success">
        Google Verified
      </Badge>
    </div>
  ),
};

export const Small: Story = { args: { size: 'sm' } };
export const Truncates: Story = {
  args: { children: 'A very long business unit name that will not fit' },
  render: (args) => (
    <div className="w-40">
      <Badge {...args} />
    </div>
  ),
};
