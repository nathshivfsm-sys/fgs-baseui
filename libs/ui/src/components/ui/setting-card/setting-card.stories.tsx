import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  SettingsBusinessTypeIcon,
  SettingsBusinessUnitIcon,
  SettingsGeneralInfoIcon,
  SettingsPostalCodesIcon,
  SettingsTaxStatesIcon,
} from '../../../icons';
import { SettingCard, SettingCardGrid } from './setting-card';

const meta = {
  title: 'Components/SettingCard',
  component: SettingCard,
  tags: ['autodocs'],
  args: {
    description:
      'Configure company details, branding, contact information, and business preferences.',
    footerText: '12 Settings',
    icon: <SettingsGeneralInfoIcon />,
    onClick: fn(),
    title: 'General Info',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['blue', 'green', 'orange', 'purple', 'neutral'],
    },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SettingCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: 'w-[24rem]' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button', { name: /General Info/ });
    card.focus();
    await expect(card).toHaveFocus();
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const LongDescription: Story = {
  args: {
    className: 'w-[24rem]',
    description:
      'Associate business types with inventory categories across every region your company operates in, including seasonal and temporary locations.',
    footerText: '18 Mappings',
    title: 'Business Type Inventory Mapping',
  },
};

/** The Setup page's Company-tab grid — five cards across the icon-tile tones. */
export const AllTones: Story = {
  render: (args) => {
    const cards = [
      {
        description:
          'Configure company details, branding, contact information, and business preferences.',
        footerText: '12 Settings',
        icon: <SettingsGeneralInfoIcon />,
        title: 'General Info',
        tone: 'blue' as const,
      },
      {
        description:
          'Manage business divisions, branches, or departments used across operations.',
        footerText: '8 Units',
        icon: <SettingsBusinessUnitIcon />,
        title: 'Business Unit',
        tone: 'green' as const,
      },
      {
        description: 'Configure tax jurisdictions, rates, and state-level settings.',
        footerText: '26 Rules',
        icon: <SettingsTaxStatesIcon />,
        title: 'Tax & States',
        tone: 'purple' as const,
      },
      {
        description:
          'Manage postal codes used for service zones and automated territory assignment.',
        footerText: '1,842 Codes',
        icon: <SettingsPostalCodesIcon />,
        title: 'Postal Codes',
        tone: 'blue' as const,
      },
      {
        description: 'Define the business types supported by your company.',
        footerText: '8 Types',
        icon: <SettingsBusinessTypeIcon />,
        title: 'Business Type',
        tone: 'orange' as const,
      },
    ];

    return (
      <SettingCardGrid className="max-w-4xl">
        {cards.map((card) => (
          <SettingCard {...args} {...card} key={card.title} />
        ))}
      </SettingCardGrid>
    );
  },
};
