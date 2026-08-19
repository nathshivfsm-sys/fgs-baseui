import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Falls back to initials when no `AvatarImage` src resolves. */
export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AM</AvatarFallback>
    </Avatar>
  ),
};

// Inline data URI keeps the story deterministic and network-free in CI.
const portrait =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%230049bc'/><circle cx='20' cy='15' r='7' fill='%23ffffff'/><path d='M6 40c0-8 6-13 14-13s14 5 14 13z' fill='%23ffffff'/></svg>";

export const WithImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="Alex Morgan" src={portrait} />
      <AvatarFallback>AM</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/** `AvatarBadge` sizes itself from the root's `data-size`. */
export const WithBadge: Story = {
  render: (args) => (
    <Avatar {...args} size="lg">
      <AvatarFallback>AM</AvatarFallback>
      <AvatarBadge aria-label="Online" role="img" />
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {['AM', 'JD', 'KP'].map((initials) => (
        <Avatar key={initials}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  ),
};
