import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { className: 'h-4 w-48' },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Circle: Story = { args: { className: 'size-10 rounded-full' } };

/** Compose several to mirror the shape of the content being loaded. */
export const TextBlock: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
};

/**
 * Skeletons are `aria-hidden`; expose the loading state on the region that
 * owns them so assistive technology is told once, not per placeholder.
 */
export const AccessibleRegion: Story = {
  render: () => (
    <div aria-busy="true" className="flex w-64 items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
      <span className="sr-only">Loading profile</span>
    </div>
  ),
};
