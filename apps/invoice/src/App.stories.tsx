import { AuthProvider, DEMO_SESSION, type AuthSession } from '@cms/shared-auth';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, within } from 'storybook/test';
import { withCmsRuntime } from '../../../.storybook/fixtures/runtime';
import { App } from './App';

const InvoiceApp = withCmsRuntime(App);

/**
 * Mounts the remote the way the shell does — under a splat route — so relative paths in
 * its route table resolve exactly as they do in the running app.
 */
function InvoiceRoutes({
  initialPath,
  session,
}: {
  initialPath: string;
  session: AuthSession | null;
}) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider initialSession={session}>
        <Routes>
          <Route path="/invoice/*" element={<InvoiceApp />} />
          <Route path="/login" element={<p>Login screen (shell)</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

const meta = {
  title: 'Features/Invoices',
  component: InvoiceRoutes,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { initialPath: '/invoice', session: DEMO_SESSION },
  argTypes: {
    initialPath: { table: { disable: true } },
    session: { table: { disable: true } },
  },
} satisfies Meta<typeof InvoiceRoutes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InvoiceList: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('INV-101')).toBeVisible();
  },
};

export const InvoiceDetail: Story = {
  args: { initialPath: '/invoice/INV-101' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Invoice INV-101' }),
    ).toBeVisible();
  },
};

/** The payment route renders for an anonymous visitor — no redirect to /login. */
export const PublicPaymentWithoutSession: Story = {
  args: { initialPath: '/invoice/payment/INV-101', session: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Pay invoice' }),
    ).toBeVisible();
    await expect(canvas.queryByText('Login screen (shell)')).toBeNull();
  },
};

/** The sibling list route, by contrast, is intercepted by the guard. */
export const ProtectedListWithoutSession: Story = {
  args: { initialPath: '/invoice', session: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText('Login screen (shell)'),
    ).toBeInTheDocument();
    await expect(canvas.queryByText('INV-101')).toBeNull();
  },
};

export const ProtectedDetailWithoutSession: Story = {
  args: { initialPath: '/invoice/INV-101', session: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText('Login screen (shell)'),
    ).toBeInTheDocument();
  },
};
