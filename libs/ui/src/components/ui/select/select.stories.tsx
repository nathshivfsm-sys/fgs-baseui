import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { MultiSelectField, SelectField } from './select';

const options = [
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Installation', value: 'installation' },
  { label: 'Unavailable option', value: 'disabled', disabled: true },
];

const businessUnits = [
  { label: 'Facility', value: 'facility' },
  { label: 'Operations', value: 'operations' },
  { label: 'Storage', value: 'storage' },
];
const meta = {
  title: 'Components/Select',
  component: SelectField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Job type',
    options,
    placeholder: 'Select type',
    onValueChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
    variant: { control: 'inline-radio', options: ['default', 'soft'] },
    error: { control: 'text' },
  },
} satisfies Meta<typeof SelectField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Job type',
    });
    await userEvent.click(trigger);
    await userEvent.click(
      await within(document.body).findByRole('option', { name: 'Maintenance' }),
    );
    await expect(args.onValueChange).toHaveBeenCalledWith('maintenance');
  },
};
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <SelectField {...args} label="Small" size="sm" />
      <SelectField {...args} label="Default" />
      <SelectField {...args} label="Large" size="lg" />
    </div>
  ),
};
export const Error: Story = {
  args: { error: 'Select a job type.', required: true },
};
export const Disabled: Story = { args: { disabled: true } };

/**
 * Multi-select with a checkbox per row. The popup stays open across selections
 * and the trigger summarises the count.
 */
export const Multiple: Story = {
  render: () => (
    <div className="w-72">
      <MultiSelectField
        label="Business units"
        onValueChange={fn()}
        options={businessUnits}
        placeholder="Select business units"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole('combobox', { name: 'Business units' });
    await expect(trigger).toHaveTextContent('Select business units');

    await userEvent.click(trigger);
    const facility = await body.findByRole('option', { name: 'Facility' });
    await userEvent.click(facility);

    // Picking one option must not dismiss the popup: the whole point of a
    // multi-select is choosing several in one pass.
    await expect(
      body.getByRole('option', { name: 'Operations' }),
    ).toBeVisible();
    await expect(facility).toHaveAttribute('data-selected');

    // The checkbox fills on the selected row and stays empty on the others.
    // Asserted because the fill comes from named-group classes that would fail
    // silently if they ever stopped compiling.
    const boxOf = (option: HTMLElement) =>
      option.querySelector<HTMLElement>('span[aria-hidden="true"]')!;
    await waitFor(() =>
      expect(getComputedStyle(boxOf(facility)).backgroundColor).not.toBe(
        getComputedStyle(
          boxOf(body.getByRole('option', { name: 'Operations' })),
        ).backgroundColor,
      ),
    );

    await userEvent.click(body.getByRole('option', { name: 'Operations' }));
    await waitFor(() => expect(trigger).toHaveTextContent('2 selected'));

    // Clicking a selected row clears it again.
    await userEvent.click(body.getByRole('option', { name: 'Facility' }));
    await waitFor(() => expect(trigger).toHaveTextContent('Operations'));

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByRole('option', { name: 'Facility' }),
      ).not.toBeInTheDocument(),
    );
  },
};

/** `renderValue` formats the trigger when the default summary is too terse. */
export const MultipleCustomSummary: Story = {
  render: () => (
    <div className="w-72">
      <MultiSelectField
        defaultValue={['facility', 'storage']}
        label="Business units"
        options={businessUnits}
        renderValue={(selected) =>
          selected.map((option) => option.label).join(', ')
        }
      />
    </div>
  ),
};

/** The Service Location form appearance: hairline border, 12px chevron. */
export const Soft: Story = {
  args: {
    label: 'State/Province',
    placeholder: 'Select state',
    required: true,
    variant: 'soft',
  },
};
