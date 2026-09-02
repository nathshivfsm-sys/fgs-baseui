import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { EditIcon } from '../../../icons';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { SelectField } from '../select';
import { TextInput } from '../text-input';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  type PopoverContentProps,
} from './popover';

const meta = {
  title: 'Components/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
} satisfies Meta<typeof PopoverContent>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example(props: PopoverContentProps) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Pricing details
      </PopoverTrigger>
      <PopoverContent {...props}>
        <PopoverHeader>
          <PopoverTitle>How price is calculated</PopoverTitle>
          <PopoverDescription>
            Material, labor, equipment, and other charges are summed before tax.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

export const Default: Story = {
  render: (args) => <Example {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Pricing details' }),
    );

    const body = within(document.body);
    const title = await body.findByText('How price is calculated');
    // The popup fades in, so wait for the enter transition to settle before
    // asserting visibility (opacity is part of `toBeVisible`).
    await waitFor(() => expect(title).toBeVisible());

    // Popovers are modal: close via keyboard so the story ends in a settled,
    // non-inert state for the a11y check.
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByText('How price is calculated'),
      ).not.toBeInTheDocument(),
    );
  },
};

export const AlignedStart: Story = {
  args: { align: 'start' },
  render: (args) => <Example {...args} />,
};

export const SideTop: Story = {
  args: { side: 'top', sideOffset: 8 },
  render: (args) => <Example {...args} />,
};

const businessUnits = [
  { label: 'Facility', value: 'facility' },
  { label: 'Operations', value: 'operations' },
  { label: 'Storage', value: 'storage' },
];

/**
 * Inline edit pattern: an icon-only trigger opens a short form. Drafts are held
 * separately from the committed values so cancelling discards them, and the
 * popover closes on submit.
 */
function EditLocationExample(props: PopoverContentProps) {
  const [name, setName] = useState('Main Office');
  const [unit, setUnit] = useState('facility');
  const [draftName, setDraftName] = useState(name);
  const [draftUnit, setDraftUnit] = useState(unit);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    // Re-seed the draft each time it opens so a cancelled edit does not leak
    // into the next one.
    if (next) {
      setDraftName(name);
      setDraftUnit(unit);
    }
    setOpen(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setName(draftName);
    setUnit(draftUnit);
    setOpen(false);
  };

  return (
    <div className="flex w-64 items-center justify-between gap-2 rounded-md border border-divider bg-surface px-3 py-2 text-control text-surface-foreground">
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium" data-testid="location-name">
          {name}
        </span>
        <span className="text-caption leading-4 text-foreground-subtle">
          {businessUnits.find((entry) => entry.value === unit)?.label}
        </span>
      </span>
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger
          render={
            <IconButton
              icon={<EditIcon className="size-3.5" />}
              label="Edit location"
              size="xs"
              variant="surface"
            />
          }
        />
        <PopoverContent align="end" className="w-80" {...props}>
          <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
            <PopoverHeader>
              <PopoverTitle>Edit location</PopoverTitle>
              <PopoverDescription>
                Changes apply to this service location only.
              </PopoverDescription>
            </PopoverHeader>
            <TextInput
              label="Location Name"
              onChange={(event) => setDraftName(event.target.value)}
              required
              value={draftName}
              variant="soft"
            />
            <SelectField
              label="Business Unit"
              onValueChange={(value) => value != null && setDraftUnit(value)}
              options={businessUnits}
              value={draftUnit}
              variant="soft"
            />
            <PopoverFooter>
              <PopoverClose render={<Button size="sm" variant="surface" />}>
                Cancel
              </PopoverClose>
              <Button size="sm" type="submit" variant="action">
                Save
              </Button>
            </PopoverFooter>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Edit icon opens a small form; saving commits the change and closes. */
export const EditForm: Story = {
  render: (args) => <EditLocationExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Edit location' }),
    );
    const field = await body.findByRole('textbox', { name: /Location Name/ });
    await waitFor(() => expect(field).toBeVisible());
    await expect(
      body.getByRole('combobox', { name: /Business Unit/ }),
    ).toBeVisible();

    await userEvent.clear(field);
    await userEvent.type(field, 'North Warehouse');
    await userEvent.click(body.getByRole('button', { name: 'Save' }));

    // Committed to the row, and the popover closed so the story settles.
    await waitFor(() =>
      expect(canvas.getByTestId('location-name')).toHaveTextContent(
        'North Warehouse',
      ),
    );
    await waitFor(() =>
      expect(body.queryByText('Edit location')).not.toBeInTheDocument(),
    );
  },
};

/** Cancelling leaves the committed value untouched and discards the draft. */
export const EditFormDiscardsOnCancel: Story = {
  render: (args) => <EditLocationExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Edit location' });

    await userEvent.click(trigger);
    const field = await body.findByRole('textbox', { name: /Location Name/ });
    await waitFor(() => expect(field).toBeVisible());
    await userEvent.clear(field);
    await userEvent.type(field, 'Discarded name');
    await userEvent.click(body.getByRole('button', { name: 'Cancel' }));

    await waitFor(() =>
      expect(body.queryByText('Edit location')).not.toBeInTheDocument(),
    );
    await expect(canvas.getByTestId('location-name')).toHaveTextContent(
      'Main Office',
    );

    // Reopening starts from the committed value, not the discarded draft.
    await userEvent.click(trigger);
    const reopened = await body.findByRole('textbox', {
      name: /Location Name/,
    });
    await waitFor(() => expect(reopened).toHaveValue('Main Office'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByText('Edit location')).not.toBeInTheDocument(),
    );
  },
};
