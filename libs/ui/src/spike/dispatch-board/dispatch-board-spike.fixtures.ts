/** SPIKE ONLY — fixture data drawn from the Dispatch Board reference screenshots. */
import type {
  SpikeTechnician,
  SpikeWorkOrder,
} from './dispatch-board-spike.types';

/** Fixed so stories are deterministic. Monday, matching the reference design. */
export const SPIKE_BASE_DATE = '2025-05-12';

const at = (time: string): string => `${SPIKE_BASE_DATE}T${time}:00`;

export const SPIKE_TECHNICIANS: readonly SpikeTechnician[] = [
  { id: 't-aaron', name: 'Aaron Smith', initials: 'AS', region: 'North', trade: 'HVAC', scheduledHours: 8, availableHours: 10 },
  { id: 't-brad', name: 'Brad Johnson', initials: 'BJ', region: 'North', trade: 'HVAC', scheduledHours: 7, availableHours: 10 },
  { id: 't-carlos', name: 'Carlos Ramirez', initials: 'CR', region: 'Central', trade: 'Electrical', scheduledHours: 8.5, availableHours: 10 },
  { id: 't-david', name: 'David Lee', initials: 'DL', region: 'Central', trade: 'Plumbing', scheduledHours: 6, availableHours: 10 },
  { id: 't-emily', name: 'Emily White', initials: 'EW', region: 'South', trade: 'HVAC', scheduledHours: 8.5, availableHours: 10 },
  { id: 't-james', name: 'James Wilson', initials: 'JW', region: 'South', trade: 'Plumbing', scheduledHours: 7, availableHours: 10 },
  { id: 't-sarah', name: 'Sarah Brown', initials: 'SB', region: 'North', trade: 'Electrical', scheduledHours: 6.5, availableHours: 10 },
];

export const SPIKE_SCHEDULED: readonly SpikeWorkOrder[] = [
  { id: 'WO-1203', title: 'HVAC Maintenance', customer: 'Acme Corporation', street: '123 Maple St', trade: 'HVAC', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-aaron', start: at('08:00'), end: at('10:00') },
  { id: 'WO-1204', title: 'AC Repair', customer: 'Bright Retail', street: '456 Oak Ave', trade: 'HVAC', priority: 'High', estimatedMinutes: 120, technicianId: 't-aaron', start: at('11:00'), end: at('13:00') },
  { id: 'WO-1205', title: 'System Installation', customer: 'Northgate Mall', street: '789 Pine Rd', trade: 'HVAC', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-aaron', start: at('14:00'), end: at('16:00') },
  { id: 'WO-1198', title: 'Preventive Maintenance', customer: 'Lakeside Clinic', street: '321 Birch Blvd', trade: 'HVAC', priority: 'Low', estimatedMinutes: 120, technicianId: 't-brad', start: at('08:00'), end: at('10:00') },
  { id: 'WO-1199', title: 'Pump Inspection', customer: 'Cedar Foods', street: '654 Cedar Ln', trade: 'HVAC', priority: 'Medium', estimatedMinutes: 90, technicianId: 't-brad', start: at('11:00'), end: at('12:30') },
  { id: 'WO-1200', title: 'Equipment Repair', customer: 'Elm Street Dental', street: '987 Elm St', trade: 'HVAC', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-brad', start: at('13:30'), end: at('15:30') },
  { id: 'WO-1186', title: 'Generator Service', customer: 'Walnut Logistics', street: '159 Walnut Ave', trade: 'Electrical', priority: 'High', estimatedMinutes: 120, technicianId: 't-carlos', start: at('08:00'), end: at('10:00') },
  { id: 'WO-1187', title: 'Electrical Repair', customer: 'Spruce Apartments', street: '753 Spruce St', trade: 'Electrical', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-carlos', start: at('10:30'), end: at('12:30') },
  { id: 'WO-1188', title: 'Panel Upgrade', customer: 'Chestnut Offices', street: '852 Chestnut St', trade: 'Electrical', priority: 'Medium', estimatedMinutes: 180, technicianId: 't-carlos', start: at('13:00'), end: at('16:00') },
  { id: 'WO-1210', title: 'Boiler Inspection', customer: 'Ash Street Hotel', street: '357 Ash St', trade: 'Plumbing', priority: 'Medium', estimatedMinutes: 180, technicianId: 't-david', start: at('08:00'), end: at('11:00') },
  { id: 'WO-1211', title: 'Boiler Repair', customer: 'Poplar Gym', street: '951 Poplar Dr', trade: 'Plumbing', priority: 'High', estimatedMinutes: 120, technicianId: 't-david', start: at('12:00'), end: at('14:00') },
  { id: 'WO-1212', title: 'System Test', customer: 'Fir Lane School', street: '753 Fir Ln', trade: 'Plumbing', priority: 'Low', estimatedMinutes: 150, technicianId: 't-david', start: at('14:30'), end: at('17:00') },
  { id: 'WO-1175', title: 'Filter Replacement', customer: 'Redwood Cafe', street: '268 Redwood Ave', trade: 'HVAC', priority: 'Low', estimatedMinutes: 60, technicianId: 't-emily', start: at('08:30'), end: at('09:30') },
  { id: 'WO-1176', title: 'Maintenance', customer: 'Dogwood Library', street: '159 Dogwood St', trade: 'HVAC', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-emily', start: at('10:00'), end: at('12:00') },
  { id: 'WO-1177', title: 'Duct Cleaning', customer: 'Ironwood Studio', street: '147 Ironwood Ct', trade: 'HVAC', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-emily', start: at('13:00'), end: at('15:00') },
  { id: 'WO-1165', title: 'Compressor Repair', customer: 'Magnolia Works', street: '369 Magnolia Ave', trade: 'Plumbing', priority: 'High', estimatedMinutes: 180, technicianId: 't-james', start: at('08:00'), end: at('11:00') },
  { id: 'WO-1166', title: 'System Check', customer: 'Hickory Motors', street: '852 Hickory Ln', trade: 'Plumbing', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-james', start: at('12:00'), end: at('14:00') },
  { id: 'WO-1167', title: 'Leak Repair', customer: 'Alder Housing', street: '951 Alder Dr', trade: 'Plumbing', priority: 'High', estimatedMinutes: 120, technicianId: 't-james', start: at('14:30'), end: at('16:30') },
  { id: 'WO-1151', title: 'Equipment Install', customer: 'Sycamore Labs', street: '123 Sycamore St', trade: 'Electrical', priority: 'Medium', estimatedMinutes: 120, technicianId: 't-sarah', start: at('08:00'), end: at('10:00') },
  { id: 'WO-1152', title: 'Calibration', customer: 'Willows Plant', street: '456 Willows St', trade: 'Electrical', priority: 'Low', estimatedMinutes: 120, technicianId: 't-sarah', start: at('11:00'), end: at('13:00') },
  { id: 'WO-1153', title: 'System Training', customer: 'Aspen Group', street: '789 Aspen Ln', trade: 'Electrical', priority: 'Low', estimatedMinutes: 120, technicianId: 't-sarah', start: at('13:30'), end: at('15:30') },
];

/** Unassigned queue. Trades are deliberately mixed so the pre-drop veto is demonstrable. */
export const SPIKE_UNASSIGNED: readonly SpikeWorkOrder[] = [
  { id: 'WO-1223', title: 'HVAC Maintenance', customer: 'Acme Corporation', street: '123 Main St, Springfield', trade: 'HVAC', priority: 'High', estimatedMinutes: 120, technicianId: null, start: null, end: null },
  { id: 'WO-1224', title: 'Plumbing Repair', customer: 'TechStart Inc', street: '456 Oak Ave, Chicago', trade: 'Plumbing', priority: 'Medium', estimatedMinutes: 90, technicianId: null, start: null, end: null },
  { id: 'WO-1225', title: 'Electrical Inspection', customer: 'Global Industries', street: '789 Pine Rd, Northside', trade: 'Electrical', priority: 'Medium', estimatedMinutes: 60, technicianId: null, start: null, end: null },
  { id: 'WO-1226', title: 'Equipment Installation', customer: 'Smart Solutions', street: '321 Elm St, Eastside', trade: 'HVAC', priority: 'Low', estimatedMinutes: 180, technicianId: null, start: null, end: null },
];

export const SPIKE_WORK_ORDERS: readonly SpikeWorkOrder[] = [
  ...SPIKE_SCHEDULED,
  ...SPIKE_UNASSIGNED,
];

/** Clones the roster up to `count` rows for the volume story. */
export function makeTechnicians(count: number): readonly SpikeTechnician[] {
  const base = SPIKE_TECHNICIANS;
  return Array.from({ length: count }, (_, i) => {
    const seed = base[i % base.length];
    const cycle = Math.floor(i / base.length);
    return cycle === 0
      ? seed
      : { ...seed, id: `${seed.id}-${cycle}`, name: `${seed.name} ${cycle + 1}` };
  });
}

/** Spreads the scheduled fixtures across `technicians` for the volume story. */
export function makeWorkOrders(
  technicians: readonly SpikeTechnician[],
): readonly SpikeWorkOrder[] {
  return technicians.flatMap((tech, i) =>
    SPIKE_SCHEDULED.slice(0, 3).map((wo, j) => ({
      ...wo,
      id: `${wo.id}-${i}-${j}`,
      trade: tech.trade,
      technicianId: tech.id,
    })),
  );
}
