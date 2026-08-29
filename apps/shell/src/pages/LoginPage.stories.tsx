import { AuthProvider, DEMO_CREDENTIALS, RequireAuth } from '@cms/shared-auth';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, userEvent, within } from 'storybook/test';
import { LoginPage } from './LoginPage';

/**
 * Rendered inside a real router with a protected destination, so the stories exercise
 * the actual redirect-after-login path rather than a mocked navigate.
 */
function LoginFlow({ initialPath }: { initialPath: string }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider initialSession={null}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<p>Home page (protected)</p>} />
            <Route path="/invoice" element={<p>Invoices (protected)</p>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

const meta = {
  title: 'Features/Login',
  component: LoginFlow,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { initialPath: '/login' },
  argTypes: { initialPath: { table: { disable: true } } },
} satisfies Meta<typeof LoginFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SuccessfulLogin: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(
      await canvas.findByText('Home page (protected)'),
    ).toBeInTheDocument();
  },
};

export const InvalidCredentials: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Regex, not an exact string: Field renders the required marker inside the
    // <label>, so its text content is "Password*".
    const password = canvas.getByLabelText(/password/i);

    await userEvent.clear(password);
    await userEvent.type(password, 'wrong-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));

    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      'not recognised',
    );
    await expect(canvas.getByRole('button', { name: 'Sign in' })).toBeVisible();
  },
};

/** A guard-intercepted URL is remembered and returned to after signing in. */
export const RedirectsToInterceptedRoute: Story = {
  args: { initialPath: '/invoice' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('button', { name: 'Sign in' }),
    ).toBeVisible();
    await expect(canvas.getByLabelText(/email address/i)).toHaveValue(
      DEMO_CREDENTIALS.email,
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(
      await canvas.findByText('Invoices (protected)'),
    ).toBeInTheDocument();
  },
};
