import type {
  LoadCompanySettings,
  SaveCompanySettings,
} from '@cms/settings-data-access';
import { ApiError } from '@cms/shared-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, fn, userEvent, within } from 'storybook/test';
import { companyProfileFixture } from '../../../.storybook/fixtures/feature-data';
import {
  STORY_COMPANY_ID,
  withCmsRuntime,
} from '../../../.storybook/fixtures/runtime';
import { App } from './App';

const SettingsApp = withCmsRuntime(App);

const resolvedSettingsLoader: LoadCompanySettings = async () =>
  companyProfileFixture;

const pendingSettingsLoader: LoadCompanySettings = () =>
  new Promise(() => undefined);

const forbiddenSettingsLoader: LoadCompanySettings = async () => {
  throw new ApiError(403, 'Forbidden');
};

const saveSpy = fn<SaveCompanySettings>(async () => undefined);

const conflictSaveSpy = fn<SaveCompanySettings>(async () => {
  throw new ApiError(409, 'Conflict');
});

function SettingsRoutes({
  initialPath = '/settings',
  loadCompanySettings,
  saveCompanySettings,
  storyCompanyId,
  storyTenantId,
}: {
  initialPath?: string;
  loadCompanySettings?: LoadCompanySettings;
  saveCompanySettings?: SaveCompanySettings;
  storyCompanyId?: string | null;
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
              storyCompanyId={storyCompanyId}
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
    storyCompanyId: { table: { disable: true } },
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
      await canvas.findByRole('textbox', { name: 'Name' }),
    ).toHaveValue('Acme Field Services');
    await expect(canvas.getByRole('textbox', { name: 'Code' })).toHaveAttribute(
      'readonly',
    );
    await expect(
      canvas.getByRole('textbox', { name: 'Company Number' }),
    ).toHaveValue('1');
    await expect(canvas.getByText('Austin, TX 78701')).toBeVisible();
    await expect(canvas.getByText('No address on file')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled();
  },
};

export const GeneralInfoSave: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: resolvedSettingsLoader,
    saveCompanySettings: saveSpy,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const website = await canvas.findByRole('textbox', { name: 'Website' });
    await userEvent.clear(website);
    await userEvent.type(website, 'www.acme.example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await canvas.findByText('Company details updated'),
    ).toBeVisible();
    // Dirty fields only: nothing but the edited Website reaches the PATCH body.
    await expect(saveSpy).toHaveBeenCalledWith(STORY_COMPANY_ID, {
      website: 'www.acme.example.com',
    });
  },
};

export const GeneralInfoCancel: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: resolvedSettingsLoader,
    saveCompanySettings: saveSpy,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('textbox', { name: 'Name' });
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    // Back on the Setup grid, not climbed out of /settings/*.
    await expect(
      await canvas.findByRole('heading', { name: 'Setup' }),
    ).toBeVisible();
    await expect(saveSpy).not.toHaveBeenCalled();
  },
};

export const GeneralInfoFromGrid: Story = {
  args: { loadCompanySettings: resolvedSettingsLoader },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /^General Info/ }),
    );
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
    const name = await canvas.findByRole('textbox', { name: 'Name' });
    await userEvent.clear(name);
    await userEvent.tab();
    await expect(await canvas.findByText('Name is required')).toBeVisible();

    const email = canvas.getByRole('textbox', { name: 'Email' });
    await userEvent.clear(email);
    await userEvent.type(email, 'not-an-email');
    await userEvent.tab();
    await expect(
      await canvas.findByText('Enter a valid email address'),
    ).toBeVisible();
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
      canvas.getByRole('status', { name: 'Loading company details' }),
    ).toBeVisible();
  },
};

export const GeneralInfoError: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: forbiddenSettingsLoader,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(
        "You don't have access to this company's settings.",
      ),
    ).toBeVisible();
  },
};

export const GeneralInfoMissingCompany: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: resolvedSettingsLoader,
    storyCompanyId: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(
        "Your session isn't linked to a company. Sign out and sign in again.",
      ),
    ).toBeVisible();
    await expect(
      canvas.queryByTestId('company-settings-form'),
    ).not.toBeInTheDocument();
  },
};

export const GeneralInfoSaveConflict: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    loadCompanySettings: resolvedSettingsLoader,
    saveCompanySettings: conflictSaveSpy,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const legalName = await canvas.findByRole('textbox', {
      name: 'Legal Name',
    });
    await userEvent.type(legalName, ' LLC');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await canvas.findByText('Settings already updated by another user.'),
    ).toBeVisible();
    // Typed values survive a failed save.
    await expect(legalName).toHaveValue('Acme Field Services LLC');
  },
};
