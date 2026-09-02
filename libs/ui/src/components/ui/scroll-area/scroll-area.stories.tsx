import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './scroll-area';

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'both'],
    },
  },
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;

const workOrders = Array.from(
  { length: 25 },
  (_, index) => `Work order WO-${1000 + index}`,
);

export const Default: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-48 w-64 rounded-md border border-border-component bg-card"
    >
      <ul className="flex flex-col gap-2 p-3 text-control text-card-foreground">
        {workOrders.map((workOrder) => (
          <li key={workOrder}>{workOrder}</li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <ScrollArea
      {...args}
      className="w-64 rounded-md border border-border-component bg-card"
    >
      <div className="flex w-max gap-3 p-3">
        {workOrders.slice(0, 10).map((workOrder) => (
          <div
            className="w-32 shrink-0 rounded-md bg-secondary p-3 text-control text-card-foreground"
            key={workOrder}
          >
            {workOrder}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** `both` also renders the corner piece where the two scrollbars meet. */
export const BothAxes: Story = {
  args: { orientation: 'both' },
  render: (args) => (
    <ScrollArea
      {...args}
      className="h-48 w-64 rounded-md border border-border-component bg-card"
    >
      <div className="w-[40rem] p-3 text-control text-card-foreground">
        {workOrders.map((workOrder) => (
          <p className="whitespace-nowrap" key={workOrder}>
            {workOrder} — scheduled, assigned, and awaiting dispatch
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};
