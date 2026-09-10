import type {
  LoadCompanySettings,
  SaveCompanySettings,
} from '@cms/settings-data-access';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  companySettingsFixture,
  errorLoader,
} from '../../../.storybook/fixtures/feature-data';
import { withCmsRuntime } from '../../../.storybook/fixtures/runtime';
import { App } from './App';

const SettingsApp = withCmsRuntime(App);

const resolvedSettingsLoader: LoadCompanySettings = async (companyId) => ({
  ...companySettingsFixture,
  companyId,
});

const pendingSettingsLoader: LoadCompanySettings = () =>
  new Promise(() => undefined);

const saveSpy = fn<SaveCompanySettings>(async (_companyId, settings) => settings);

function SettingsRoutes({
  initialPath = '/settings',
  loadCompanySettings,
  saveCompanySettings,
  storyTenantId,
}: {
  initialPath?: string;
  loadCompanySettings?: LoadCompanySettings;
  saveCompanySettings?: SaveCompanySettings;
  storyTenantId?: string;
}) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          element={
            <SettingsApp
              loadCompanySettings={loadCompanySettings}
              saveCompanySettings={saveCompanySettings}
              storyTenantId={storyTenantId}
            />
          }
          path="/settings/*"
        />
      </Routes>
    </MemoryRouter>
  );
}

const meta = {
  title: 'Features/Settings',
  component: SettingsRoutes,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { initialPath: '/settings' },
  argTypes: {
    initialPath: { table: { disable: true } },
    loadCompanySettings: { table: { disable: true } },
    saveCompanySettings: { table: { disable: true } },
  },
} satisfies Meta<typeof SettingsRoutes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Setup' })).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Company' })).toHaveAttribute(
      'data-active',
      '',
    );
    await expect(
      canvas.getByRole('button', { name: /^General Info/ }),
    ).toBeVisible();
  },
};

export const SwitchTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Users & Payroll' }));
    await expect(canvas.getByRole('button', { name: /^Roles/ })).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /^General Info/ }),
    ).not.toBeInTheDocument();
  },
};

export const SearchFilter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Search settings'), 'tax');
    await expect(
      canvas.getByRole('button', { name: /^Tax & States/ }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /^Business Unit/ }),
    ).not.toBeInTheDocument();
  },
};

export const SearchNoResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('Search settings'),
      'zzz-no-match',
    );
    await expect(
      canvas.getByText('No settings match "zzz-no-match"'),
    ).toBeVisible();
  },
};

export const GeneralInfo: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: resolvedSettingsLoader,
    saveCompanySettings: saveSpy,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'General Info' }),
    ).toBeVisible();
    await expect(canvas.getByLabelText('Company name')).toHaveValue(
      'Graceful Cleaning',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save settings' }),
    );
    await expect(await canvas.findByText('Settings updated successfully')).toBeVisible();
    await expect(saveSpy).toHaveBeenCalled();
  },
};

export const GeneralInfoFromGrid: Story = {
  args: { loadCompanySettings: resolvedSettingsLoader },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /^General Info/ }));
    await expect(
      await canvas.findByRole('heading', { name: 'General Info' }),
    ).toBeVisible();
  },
};

export const GeneralInfoValidation: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: resolvedSettingsLoader,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = await canvas.findByLabelText('Contact email');
    await userEvent.clear(email);
    await userEvent.type(email, 'not-an-email');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Save settings' }),
    );
    await expect(await canvas.findByText('Valid email required')).toBeVisible();
  },
};

export const GeneralInfoLoading: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: pendingSettingsLoader,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('status', { name: 'Loading company settings…' }),
    ).toBeVisible();
  },
};

export const GeneralInfoAddPto: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: resolvedSettingsLoader,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('heading', { name: 'General Info' });
    await userEvent.click(canvas.getByRole('button', { name: 'Add PTO type' }));
    await expect(canvas.getByTestId('pto-row-1')).toBeVisible();
  },
};

export const GeneralInfoError: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: errorLoader('Settings service unavailable.'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText('Settings service unavailable.'),
    ).toBeVisible();
  },
};
