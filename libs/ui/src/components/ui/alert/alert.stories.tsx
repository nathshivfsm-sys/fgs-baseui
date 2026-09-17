import type { MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button';
import { Alert, ALERT_VARIANTS } from './alert';
import { alert } from './show-alert';
import { ALERT_POSITIONS, type AlertPosition } from './toaster';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    title: 'Changes saved',
    description: 'Company details were updated successfully.',
  },
  argTypes: {
    variant: { control: 'select', options: [...ALERT_VARIANTS] },
    icon: { control: false },
    onDismiss: { action: 'dismissed' },
  },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: 'info', title: 'Pricing guidance' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toBeInTheDocument();
  },
};

export const Success: Story = { args: { variant: 'success' } };

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Review required',
    description: 'This postal code overlaps an existing zone.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Could not save',
    description: 'The server rejected the request. Try again.',
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeInTheDocument();
  },
};

export const Dismissible: Story = {
  args: { variant: 'success', onDismiss: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Dismiss notification' }),
    );
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};

export const WithoutIcon: Story = {
  args: { variant: 'info', icon: false, title: 'Session expiring soon' },
};

const ToastPlayground = () => {
  const handleSuccess = () => {
    alert.success('Changes saved', {
      description: 'Company details were updated successfully.',
    });
  };
  const handleError = () => {
    alert.error('Could not save', {
      description: 'The server rejected the request. Try again.',
    });
  };
  const handleWarning = () => {
    alert.warning('Review required', {
      description: 'This postal code overlaps an existing zone.',
    });
  };
  const handleInfo = () => {
    alert.info('Tip', {
      description: 'Use filters to narrow the catalog list.',
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handleSuccess} variant="action">
        Show success
      </Button>
      <Button onClick={handleError} variant="destructive">
        Show error
      </Button>
      <Button onClick={handleWarning} variant="surface">
        Show warning
      </Button>
      <Button onClick={handleInfo} variant="outline">
        Show info
      </Button>
    </div>
  );
};

export const Toast: Story = {
  render: () => <ToastPlayground />,
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show success' }));

    const body = within(document.body);
    await expect(await body.findByText('Changes saved')).toBeVisible();

    await userEvent.click(
      body.getByRole('button', { name: 'Dismiss notification' }),
    );
    await waitFor(() =>
      expect(body.queryByText('Changes saved')).not.toBeInTheDocument(),
    );
  },
};

const PositionPlayground = () => {
  const handlePositionClick = (event: MouseEvent<HTMLButtonElement>) => {
    const position = event.currentTarget.dataset.position as AlertPosition;
    alert.info(`Position: ${position}`, {
      description: 'Each toast can override the default Toaster position.',
      position,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {ALERT_POSITIONS.map((position) => (
        <Button
          data-position={position}
          key={position}
          onClick={handlePositionClick}
          size="sm"
          variant="surface"
        >
          {position}
        </Button>
      ))}
    </div>
  );
};

export const Positions: Story = {
  render: () => <PositionPlayground />,
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'top-right' }));
    const body = within(document.body);
    await expect(await body.findByText('Position: top-right')).toBeVisible();
    alert.remove();
  },
};
