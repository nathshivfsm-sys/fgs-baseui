import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  SectionCard,
  SectionContent,
  SectionHeader,
  SectionTitle,
} from './section-card';
import { TextInput } from '../text-input/text-input';

const meta = {
  title: 'Components/SectionCard',
  component: SectionCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SectionCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SectionCard className="w-[40rem]">
      <SectionHeader>
        <SectionTitle>Pricing</SectionTitle>
      </SectionHeader>
      <SectionContent className="grid grid-cols-2 gap-4">
        <TextInput label="Equipment" placeholder="Enter amount" />
        <TextInput label="Material" placeholder="Enter amount" />
      </SectionContent>
    </SectionCard>
  ),
};
export const Compact: Story = {
  render: () => (
    <SectionCard className="w-80">
      <SectionTitle>Membership</SectionTitle>
    </SectionCard>
  ),
};
