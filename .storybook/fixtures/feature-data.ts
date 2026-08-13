import type { Lead } from '../../apps/lead/src/App';
import type { Workorder } from '../../apps/workorder/src/App';

export const leadFixtures = [
  { id: 'LD-208', name: 'Avery Stone · northwind', stage: 'Qualified' },
  { id: 'LD-209', name: 'Morgan Lee', stage: 'New' },
] satisfies readonly Lead[];

export const workorderFixtures = [
  { id: 'WO-1042', title: 'Inspect HVAC · northwind', status: 'Open' },
  {
    id: 'WO-1043',
    title: 'Replace loading-bay sensor',
    status: 'Scheduled',
  },
] satisfies readonly Workorder[];

export const resolvedLoader =
  <Item>(items: readonly Item[]) =>
  async () =>
    items;

export const emptyLoader =
  <Item>() =>
  async (): Promise<readonly Item[]> => [];

export const pendingLoader =
  <Item>() =>
  () =>
    new Promise<readonly Item[]>(() => undefined);

export const errorLoader = (message: string) => async () => {
  throw new Error(message);
};
