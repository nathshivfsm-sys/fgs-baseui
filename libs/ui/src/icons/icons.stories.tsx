import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ColumnsIcon,
  EditIcon,
  ExportIcon,
  FilterIcon,
  ImportIcon,
  LocationPinIcon,
  LockIcon,
  MessageIcon,
  MoreVerticalIcon,
  OrganizationIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  SettingsBusinessTypeIcon,
  SettingsBusinessUnitIcon,
  SettingsGeneralInfoIcon,
  SettingsIcon,
  SettingsPostalCodesIcon,
  SettingsTaxStatesIcon,
  SortIcon,
  TrendingUpIcon,
} from './index';

const icons = [
  ['Alert triangle', AlertTriangleIcon],
  ['Check', CheckIcon],
  ['Chevron down', ChevronDownIcon],
  ['Chevron left', ChevronLeftIcon],
  ['Chevron right', ChevronRightIcon],
  ['Columns', ColumnsIcon],
  ['Edit', EditIcon],
  ['Export', ExportIcon],
  ['Filter', FilterIcon],
  ['Import', ImportIcon],
  ['Location pin', LocationPinIcon],
  ['Lock', LockIcon],
  ['Message', MessageIcon],
  ['More vertical', MoreVerticalIcon],
  ['Organization', OrganizationIcon],
  ['Phone', PhoneIcon],
  ['Plus', PlusIcon],
  ['Search', SearchIcon],
  ['Settings', SettingsIcon],
  ['Settings: business type', SettingsBusinessTypeIcon],
  ['Settings: business unit', SettingsBusinessUnitIcon],
  ['Settings: general info', SettingsGeneralInfoIcon],
  ['Settings: postal codes', SettingsPostalCodesIcon],
  ['Settings: tax & states', SettingsTaxStatesIcon],
  ['Sort', SortIcon],
  ['Trending up', TrendingUpIcon],
] as const;

const meta = {
  title: 'Components/Icons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reusable, currentColor SVG components extracted from the Service Location Figma frame.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
      {icons.map(([name, Icon]) => (
        <div
          className="flex items-center gap-3 rounded-md border border-divider bg-surface p-3 text-surface-foreground"
          key={name}
        >
          <Icon className="size-6 shrink-0" />
          <span className="text-caption">{name}</span>
        </div>
      ))}
    </div>
  ),
};
