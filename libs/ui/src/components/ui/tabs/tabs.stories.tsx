import { useState } from 'react';
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
function ControlledExample() {
  const [value, setValue] = useState('details');
  return <Example onValueChange={setValue} value={value} />;
}
export const Controlled: Story = { render: () => <ControlledExample /> };
export const Uncontrolled: Story = { render: () => <Example /> };
