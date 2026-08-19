import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionProps,
} from './accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

function Example(props: AccordionProps) {
  return (
    <Accordion className="w-80" {...props}>
      <AccordionItem value="pricing">
        <AccordionTrigger>Pricing</AccordionTrigger>
        <AccordionContent>
          Total service price is the sum of material, labor, equipment, and
          other charges.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="taxes">
        <AccordionTrigger>Taxes</AccordionTrigger>
        <AccordionContent>
          Taxable services use the business unit&apos;s configured tax rate.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem disabled value="archived">
        <AccordionTrigger>Archived (unavailable)</AccordionTrigger>
        <AccordionContent>Not editable.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const Default: Story = {
  render: (args) => <Example {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Pricing' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};

export const DefaultOpen: Story = {
  render: (args) => <Example {...args} defaultValue={['pricing']} />,
};

/** Base UI opens one panel at a time unless `multiple` is set. */
export const MultipleOpen: Story = {
  render: (args) => (
    <Example {...args} defaultValue={['pricing', 'taxes']} multiple />
  ),
};
