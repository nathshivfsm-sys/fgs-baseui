import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreVerticalIcon } from '../../../icons';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'default'] } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Service location</CardTitle>
        <CardDescription>
          Primary address used for dispatch and invoicing.
        </CardDescription>
      </CardHeader>
      <CardContent>1200 Market Street, Suite 400, Philadelphia, PA</CardContent>
    </Card>
  ),
};

/** `CardAction` occupies the header's second column. */
export const WithAction: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Service location</CardTitle>
        <CardDescription>Primary address.</CardDescription>
        <CardAction>
          <IconButton
            icon={<MoreVerticalIcon />}
            label="Location actions"
            size="sm"
            variant="ghost"
          />
        </CardAction>
      </CardHeader>
      <CardContent>1200 Market Street, Suite 400</CardContent>
    </Card>
  ),
};

/** A `CardFooter` removes the card's bottom padding and sits edge to edge. */
export const WithFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Discard changes?</CardTitle>
        <CardDescription>Unsaved edits will be lost.</CardDescription>
      </CardHeader>
      <CardFooter className="justify-end">
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm">Discard</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <Card {...args} className="w-72">
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Tighter spacing and title size.</CardDescription>
      </CardHeader>
      <CardContent>Uses the 12px spacing scale.</CardContent>
    </Card>
  ),
};
