import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState, type ReactNode } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LocationPinIcon, PhoneIcon } from '../../../icons';
import { Button } from '../button';
import { Body, BodySmall, Heading1, Heading2 } from '../typography';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '../dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import {
  DataTableIconCell,
  DataTableLinkCell,
  DataTableRowActions,
  DataTableStackedCell,
} from './components/data-table-cells';
import { createDataTableColumnHelper } from './data-table-features';
import { DataTable, type DataTableStatus } from './data-table';
import {
  createMockLocations,
  mockBusinessUnits,
  mockLocations,
  type MockLocation,
} from './data-table.mocks';

const column = createDataTableColumnHelper<MockLocation>();

type LocationsTableLayout = 'default' | 'embedded' | 'read-only';

interface LocationsTableLayoutOptions {
  showActions: boolean;
  showPagination: boolean;
  showSelection: boolean;
  showToolbar: boolean;
}

const locationsTableLayouts: Record<
  LocationsTableLayout,
  LocationsTableLayoutOptions
> = {
  default: {
    showActions: true,
    showPagination: true,
    showSelection: true,
    showToolbar: true,
  },
  embedded: {
    showActions: false,
    showPagination: false,
    showSelection: false,
    showToolbar: false,
  },
  'read-only': {
    showActions: false,
    showPagination: true,
    showSelection: false,
    showToolbar: true,
  },
};

function useLocationColumns(
  onEdit: (location: MockLocation) => void,
  showActions: boolean,
) {
  return useMemo(() => {
    const columns = [
      column.accessor('id', {
        header: 'ID',
        meta: { label: 'ID' },
        cell: ({ getValue }) => (
          <DataTableLinkCell href="#location">{getValue()}</DataTableLinkCell>
        ),
      }),
      column.accessor('name', {
        header: 'Location Name',
        meta: { label: 'Location Name' },
        cell: ({ row }) => (
          <DataTableStackedCell
            primary={row.original.name}
            secondary={row.original.subtitle}
          />
        ),
      }),
      column.accessor('address', {
        header: 'Address',
        enableSorting: false,
        meta: { label: 'Address' },
        cell: ({ row }) => (
          <DataTableStackedCell
            primary={row.original.address}
            secondary={row.original.city}
            tone="muted"
          />
        ),
      }),
      column.accessor('phone', {
        header: 'Phone',
        meta: { label: 'Phone' },
        cell: ({ getValue }) => (
          <DataTableIconCell icon={<PhoneIcon className="size-3.5" />}>
            {getValue()}
          </DataTableIconCell>
        ),
      }),
      column.accessor('businessUnit', {
        header: 'Business Unit',
        meta: { label: 'Business Unit', wrap: true, cellClassName: 'max-w-32' },
      }),
    ];

    if (!showActions) return columns;

    return [
      ...columns,
      column.display({
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        meta: { align: 'center', label: 'Actions' },
        cell: ({ row }) => (
          <DataTableRowActions
            actions={[
              { label: 'View details', onSelect: () => undefined },
              { label: 'Duplicate', onSelect: () => undefined },
              {
                label: 'Delete',
                destructive: true,
                onSelect: () => undefined,
                separatorBefore: true,
              },
            ]}
            editLabel={`Edit ${row.original.name}`}
            onEdit={() => onEdit(row.original)}
          />
        ),
      }),
    ];
  }, [onEdit, showActions]);
}

function LocationScopeSelect() {
  return (
    <Select defaultValue="all">
      <SelectTrigger
        aria-label="Location scope"
        className="w-auto gap-2 border-input bg-surface pr-3 font-medium"
      >
        <span className="flex items-center gap-2">
          <LocationPinIcon className="size-4 text-icon-muted" />
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Locations</SelectItem>
        <SelectItem value="active">Active Locations</SelectItem>
        <SelectItem value="archived">Archived Locations</SelectItem>
      </SelectContent>
    </Select>
  );
}

function BusinessUnitFilter({
  onChange,
}: {
  onChange: (businessUnit: string) => void;
}) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Business unit</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => onChange('all')}>
        All business units
      </DropdownMenuItem>
      {mockBusinessUnits.map((businessUnit) => (
        <DropdownMenuItem
          key={businessUnit}
          onClick={() => onChange(businessUnit)}
        >
          {businessUnit}
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
}

function LocationTableMenu() {
  return (
    <>
      <DropdownMenuItem>Export as CSV</DropdownMenuItem>
      <DropdownMenuItem>Import locations</DropdownMenuItem>
      <DropdownMenuItem>Print view</DropdownMenuItem>
    </>
  );
}

interface LocationsTableProps {
  className?: string;
  data?: MockLocation[];
  enableColumnResizing?: boolean;
  errorState?: ReactNode;
  layout?: LocationsTableLayout;
  onEdit?: (location: MockLocation) => void;
  onRowActivate?: (location: MockLocation) => void;
  showColumnVisibility?: boolean;
  showFilter?: boolean;
  showMenu?: boolean;
  showScope?: boolean;
  showSearch?: boolean;
  status?: DataTableStatus;
}

/** The Locations grid from the design, assembled from DataTable pieces. */
function LocationsTable({
  className,
  data = mockLocations,
  enableColumnResizing,
  errorState,
  layout = 'default',
  onEdit = () => undefined,
  onRowActivate,
  showColumnVisibility,
  showFilter,
  showMenu,
  showScope,
  showSearch,
  status,
}: LocationsTableProps) {
  const [unit, setUnit] = useState<string>('all');
  const layoutOptions = locationsTableLayouts[layout];
  const columns = useLocationColumns(onEdit, layoutOptions.showActions);
  const rows = useMemo(
    () =>
      unit === 'all'
        ? data
        : data.filter((location) => location.businessUnit === unit),
    [data, unit],
  );
  const toolbarStart =
    (showScope ?? layoutOptions.showToolbar) ? (
      <LocationScopeSelect />
    ) : undefined;
  const filterContent =
    (showFilter ?? layoutOptions.showToolbar) ? (
      <BusinessUnitFilter onChange={setUnit} />
    ) : undefined;
  const menuContent =
    (showMenu ?? layoutOptions.showActions) ? <LocationTableMenu /> : undefined;

  return (
    <DataTable
      className={className}
      columns={columns}
      data={rows}
      enableColumnResizing={enableColumnResizing}
      showColumnVisibility={showColumnVisibility ?? layoutOptions.showToolbar}
      enablePagination={layoutOptions.showPagination}
      enableRowSelection={layoutOptions.showSelection}
      enableSearch={showSearch ?? layoutOptions.showToolbar}
      errorState={errorState}
      filterActive={unit !== 'all'}
      filterContent={filterContent}
      getRowId={(row) => row.id}
      getRowLabel={(row) => `Open ${row.name}`}
      menuContent={menuContent}
      onRowActivate={onRowActivate}
      rowLabel="locations"
      searchPlaceholder="Search locations..."
      status={status}
      tableLabel="Locations"
      toolbarStart={toolbarStart}
    />
  );
}

function FullPageFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <BodySmall
              className="text-caption font-semibold tracking-wide"
              color="primary"
              isUpperCase
            >
              Operations
            </BodySmall>
            <Heading1 bold className="text-2xl">
              Locations
            </Heading1>
            <BodySmall className="mt-1" color="foreground-muted">
              Manage service locations and their assigned business units.
            </BodySmall>
          </div>
          <Button>Add location</Button>
        </header>
        {children}
      </div>
    </main>
  );
}

const meta = {
  title: 'Components/DataTable',
  component: LocationsTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    layout: {
      control: 'select',
      options: ['default', 'embedded', 'read-only'],
    },
    status: {
      control: 'select',
      options: ['idle', 'loading', 'refetching', 'error'],
    },
  },
  args: { onEdit: fn() },
} satisfies Meta<typeof LocationsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Locations grid exactly as designed: 48 rows, 10 per page, 5 pages. */
export const Default: Story = {};

/** Full-page application composition with page heading and primary action. */
export const FullPageLayout: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <FullPageFrame>
      <LocationsTable {...args} />
    </FullPageFrame>
  ),
};

/** A toolbar-free table embedded inside a denser secondary surface. */
export const EmbeddedLayout: Story = {
  args: {
    data: mockLocations.slice(0, 6),
    layout: 'embedded',
  },
  render: (args) => (
    <section className="mx-auto flex max-w-5xl flex-col gap-3">
      <div>
        <Heading2 className="text-lg">Recent locations</Heading2>
        <Body color="foreground-muted">
          The six most recently updated locations.
        </Body>
      </div>
      <LocationsTable {...args} />
    </section>
  ),
};

/** Read-only composition: filtering remains available, mutations are removed. */
export const ReadOnlyLayout: Story = {
  args: { layout: 'read-only' },
};

/** Table content with pagination as the only table-level control. */
export const PaginationOnly: Story = {
  args: {
    layout: 'read-only',
    showColumnVisibility: false,
    showFilter: false,
    showMenu: false,
    showScope: false,
    showSearch: false,
  },
};

/** Keeps scope and view actions while removing filter and search controls. */
export const WithoutFilterAndSearch: Story = {
  args: {
    showFilter: false,
    showSearch: false,
  },
};

/** Full right-hand toolbar without the left location-scope dropdown. */
export const WithoutLeftDropdown: Story = {
  args: {
    showScope: false,
  },
};

/** Constrained layout used to verify toolbar wrapping and horizontal scrolling. */
export const NarrowContainerLayout: Story = {
  args: { data: mockLocations.slice(0, 12) },
  render: (args) => (
    <div className="mx-auto w-[28rem] max-w-[calc(100vw-2rem)]">
      <LocationsTable {...args} />
    </div>
  ),
};

/** Existing rows stay visible while a server refresh is in flight. */
export const RefetchingLayout: Story = {
  args: { status: 'refetching' },
};

/** Dedicated failure state with a consumer-owned retry action. */
export const ErrorLayout: Story = {
  args: {
    status: 'error',
    errorState: (
      <div className="flex flex-col items-center gap-3">
        <div>
          <Body className="font-semibold" color="heading">
            Locations unavailable
          </Body>
          <Body className="mt-1" color="foreground-muted">
            Check your connection and try again.
          </Body>
        </div>
        <Button size="sm" variant="outline">
          Try again
        </Button>
      </div>
    ),
  },
};

export const Sorting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Location Name' }),
    );
    const header = canvas.getByRole('columnheader', { name: /Location Name/ });
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
  },
};

/** 240 rows so the pager collapses the middle range behind an ellipsis. */
export const ManyPages: Story = {
  args: { data: createMockLocations(240) },
};

export const Loading: Story = {
  args: { status: 'loading' },
};

export const Empty: Story = {
  args: { data: [] },
};
