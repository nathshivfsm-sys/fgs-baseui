import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DescriptionItem, DescriptionList } from './description-list';

const meta = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    columns: { control: 'inline-radio', options: [1, 2, 3, 4] },
    gap: { control: 'inline-radio', options: ['default', 'tight'] },
  },
} satisfies Meta<typeof DescriptionList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[32rem]">
      <DescriptionList {...args}>
        <DescriptionItem term="Location ID">LOC-1001</DescriptionItem>
        <DescriptionItem term="Business Unit">Facility</DescriptionItem>
        <DescriptionItem term="Address">
          124 Oak Street, Suite 78
        </DescriptionItem>
        <DescriptionItem term="Phone">(217) 555-0192</DescriptionItem>
      </DescriptionList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('LOC-1001')).toBeVisible();
  },
};

export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => (
    <div className="w-[40rem]">
      <DescriptionList {...args}>
        <DescriptionItem term="Size">3,500 sqft</DescriptionItem>
        <DescriptionItem term="Year built">2010</DescriptionItem>
        <DescriptionItem term="Bedrooms">4</DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

/** Empty values fall back to an em dash rather than collapsing the row. */
export const EmptyValue: Story = {
  render: (args) => (
    <div className="w-[32rem]">
      <DescriptionList {...args}>
        <DescriptionItem term="Website">{null}</DescriptionItem>
        <DescriptionItem term="Credit Status">Good Standing</DescriptionItem>
      </DescriptionList>
    </div>
  ),
};
