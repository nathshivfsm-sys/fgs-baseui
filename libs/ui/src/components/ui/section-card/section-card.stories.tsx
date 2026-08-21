import type { Meta, StoryObj } from '@storybook/react-vite';
import { LocationPinIcon } from '../../../icons';
import {
  SectionCard,
  SectionContent,
  SectionHeader,
  SectionSubheading,
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

/** The Service Location form panel: 12px radius, hairline border, 20px padding. */
export const FormPanel: Story = {
  render: () => (
    <SectionCard
      className="w-[38rem]"
      padding="comfortable"
      radius="panel"
      tone="soft"
    >
      <SectionHeader bordered>
        <LocationPinIcon aria-hidden="true" className="size-4 text-action" />
        <SectionTitle size="sm">Service Location Information</SectionTitle>
      </SectionHeader>
      <SectionContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Location Name"
            placeholder="Location Name"
            required
            variant="soft"
          />
          <TextInput
            label="Display Name"
            placeholder="Display Name"
            required
            variant="soft"
          />
        </div>
        <SectionSubheading>Address</SectionSubheading>
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Address Line 1"
            placeholder="Address Line 1"
            required
            variant="soft"
          />
          <TextInput
            label="Address Line 2"
            placeholder="Address Line 2"
            variant="soft"
          />
        </div>
      </SectionContent>
    </SectionCard>
  ),
};
