import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TagsInput } from './tags-input';

const meta = {
  title: 'Components/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Tags', onValueChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
    variant: { control: 'inline-radio', options: ['default', 'soft'] },
  },
  render: (args) => (
    <div className="w-96">
      <TagsInput {...args} />
    </div>
  ),
} satisfies Meta<typeof TagsInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Tags' });
    await userEvent.type(input, 'priority{Enter}');
    await expect(args.onValueChange).toHaveBeenCalledWith(['priority']);
    await expect(within(canvasElement).getByText('priority')).toBeVisible();
  },
};

/** The Service Location form appearance. */
export const Soft: Story = {
  args: { variant: 'soft', defaultValue: ['commercial', 'hvac'] },
};

export const RemoveWithBackspace: Story = {
  args: { defaultValue: ['hvac', 'plumbing'] },
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Tags' });
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');
    await expect(args.onValueChange).toHaveBeenCalledWith(['hvac']);
  },
};

export const RemoveWithButton: Story = {
  args: { defaultValue: ['hvac'] },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Remove hvac' }),
    );
    await expect(args.onValueChange).toHaveBeenCalledWith([]);
  },
};

export const MaxTags: Story = {
  args: {
    defaultValue: ['one', 'two'],
    maxTags: 2,
    helperText: 'Up to 2 tags',
  },
};
export const Disabled: Story = {
  args: { defaultValue: ['hvac'], disabled: true },
};
export const Error: Story = {
  args: { error: 'At least one tag is required.', required: true },
};

/** The remove control sits to the right of the label, on the same line. */
export const ChipLayout: Story = {
  args: { defaultValue: ['commercial'], variant: 'soft' },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector<HTMLElement>(
      '[data-slot="badge"]',
    );
    const remove = within(canvasElement).getByRole('button', {
      name: 'Remove commercial',
    });
    const badgeRect = badge!.getBoundingClientRect();
    const removeRect = remove.getBoundingClientRect();

    // A chip whose remove icon wrapped below the text would be roughly twice
    // as tall as a single line.
    await expect(badgeRect.height).toBeLessThan(24);
    // Vertically centred in the chip rather than stacked underneath it.
    const badgeMid = badgeRect.top + badgeRect.height / 2;
    const removeMid = removeRect.top + removeRect.height / 2;
    await expect(Math.abs(badgeMid - removeMid)).toBeLessThanOrEqual(2);
    await expect(removeRect.right).toBeLessThanOrEqual(badgeRect.right + 1);
  },
};

/** Many tags wrap onto new rows and the control grows to contain them. */
export const ManyTags: Story = {
  args: {
    defaultValue: [
      'commercial',
      'hvac',
      'plumbing',
      'maintenance',
      'priority',
      'north-zone',
      'tax-exempt',
      'net-30',
    ],
    variant: 'soft',
  },
  render: (args) => (
    <div className="w-72">
      <TagsInput {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector<HTMLElement>(
      '[data-slot="tags-input"]',
    );
    const shellRect = shell!.getBoundingClientRect();

    // The control grew instead of clipping, so nothing scrolls or spills out.
    await expect(shell!.scrollHeight).toBeLessThanOrEqual(
      shell!.clientHeight + 1,
    );
    await expect(shellRect.height).toBeGreaterThan(36);

    for (const badge of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="badge"]',
    )) {
      const rect = badge.getBoundingClientRect();
      await expect(rect.bottom).toBeLessThanOrEqual(shellRect.bottom + 1);
      await expect(rect.right).toBeLessThanOrEqual(shellRect.right + 1);
    }
  },
};
