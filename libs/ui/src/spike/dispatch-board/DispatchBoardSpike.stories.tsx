/**
 * SPIKE ONLY — evaluation harness, not a design-system component.
 *
 * a11y is set to 'todo' rather than the workspace default of 'error'. That is
 * deliberate and is itself a finding: FullCalendar owns the grid DOM, so its
 * violations must be measured before we agree to inherit them. Leaving it at
 * 'error' would just block the spike without telling us anything.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DispatchBoardSpike } from './DispatchBoardSpike';
import {
  makeTechnicians,
  makeWorkOrders,
  SPIKE_UNASSIGNED,
} from './dispatch-board-spike.fixtures';

const meta = {
  title: 'Spikes/Dispatch Board',
  component: DispatchBoardSpike,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof DispatchBoardSpike>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The core question: technicians as rows, work orders positioned on an hour
 * axis, and all four gestures. Trade matching is enforced, so WO-1224
 * (Plumbing) will refuse to drop on Aaron Smith (HVAC) and WO-1223 (HVAC)
 * will refuse David Lee (Plumbing). Watch the gesture log.
 */
export const Default: Story = {};

/** Same board with the pre-drop veto off, to contrast the two behaviours. */
export const WithoutTradeMatching: Story = {
  args: { enforceTradeMatch: false },
};

/** Does a full roster stay usable? This is the unverified virtualization question. */
export const Volume50Technicians: Story = {
  args: {
    technicians: makeTechnicians(50),
    workOrders: [...makeWorkOrders(makeTechnicians(50)), ...SPIKE_UNASSIGNED],
    heightPx: 640,
  },
};

export const Volume100Technicians: Story = {
  args: {
    technicians: makeTechnicians(100),
    workOrders: [...makeWorkOrders(makeTechnicians(100)), ...SPIKE_UNASSIGNED],
    heightPx: 640,
  },
};

/** The stated ceiling in the spec. If this is unusable, row pagination is required. */
export const Volume200Technicians: Story = {
  args: {
    technicians: makeTechnicians(200),
    workOrders: [...makeWorkOrders(makeTechnicians(200)), ...SPIKE_UNASSIGNED],
    heightPx: 640,
  },
};
