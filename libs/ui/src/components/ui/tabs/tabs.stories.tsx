import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
function Example({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs
      defaultValue={value ? undefined : 'details'}
      onValueChange={onValueChange}
      value={value}
    >
      <TabsList aria-label="Pricebook sections">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="material">Material</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
        <TabsTrigger disabled value="other">
          Other
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">Details content</TabsContent>
      <TabsContent value="material">Material content</TabsContent>
      <TabsContent value="equipment">Equipment content</TabsContent>
    </Tabs>
  );
}

export const Default: Story = {
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const details = canvas.getByRole('tab', { name: 'Details' });
    details.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Material' })).toHaveFocus();
    await expect(canvas.getByText('Material content')).toBeVisible();
  },
};
export const DisabledTab: Story = { render: () => <Example /> };

/** Compact notes tabs from the Service Location form. */
export const Compact: Story = {
  render: () => (
    <Tabs defaultValue="internal">
      <TabsList aria-label="Notes" bordered className="w-96">
        <TabsTrigger size="sm" tone="action" value="internal">
          Internal Notes
        </TabsTrigger>
        <TabsTrigger size="sm" tone="action" value="external">
          External Notes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="internal">Internal notes content</TabsContent>
      <TabsContent value="external">External notes content</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'External Notes' }));
    await expect(canvas.getByText('External notes content')).toBeVisible();
  },
};
