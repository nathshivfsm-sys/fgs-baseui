/**
 * Mock rows for the DataTable stories and local prototyping. Not exported from
 * the package entry point so it never ships in consumer bundles.
 */
export interface MockLocation {
  address: string;
  businessUnit: string;
  city: string;
  id: string;
  name: string;
  phone: string;
  subtitle: string;
}

const seed: ReadonlyArray<Omit<MockLocation, 'id'>> = [
  {
    address: '124 Oak Street, Suite 78',
    businessUnit: 'Facility Maintenance',
    city: 'Industrial City, IL 62701',
    name: 'Main Office',
    phone: '(217) 555-0192',
    subtitle: 'Graceful Cleaning HQ',
  },
  {
    address: '124 Oak Street, Suite 78',
    businessUnit: 'Facility Maintenance',
    city: 'Industrial City, IL 62701',
    name: 'Unicart LLC',
    phone: '(217) 555-0192',
    subtitle: 'Unicart Logistics',
  },
  {
    address: '500 Pine Avenue',
    businessUnit: 'Facility Maintenance',
    city: 'Springfield, IL 62702',
    name: 'West Facility',
    phone: '(217) 555-0192',
    subtitle: 'West Springfield Facility',
  },
  {
    address: '890 North Drive',
    businessUnit: 'Warehouse Operations',
    city: 'Normal, IL 61761',
    name: 'North Warehouse',
    phone: '(217) 555-0192',
    subtitle: 'North Distribution Center',
  },
  {
    address: '75 South Main St.',
    businessUnit: 'Facility Maintenance',
    city: 'Decatur, IL 62523',
    name: 'South Office',
    phone: '(217) 555-0192',
    subtitle: 'Decatur Office',
  },
  {
    address: '300 Central Plaza',
    businessUnit: 'Regional Operations',
    city: 'Champaign, IL 61820',
    name: 'Regional Hub',
    phone: '(217) 555-0192',
    subtitle: 'Champaign Hub',
  },
  {
    address: '10 Market Street',
    businessUnit: 'Facility Maintenance',
    city: 'Peoria, IL 61602',
    name: 'Downtown Office',
    phone: '(217) 555-0192',
    subtitle: 'Peoria Office',
  },
  {
    address: '1200 West Road',
    businessUnit: 'Equipment Storage',
    city: 'Bloomington, IL 61704',
    name: 'Equipment Yard',
    phone: '(217) 555-0192',
    subtitle: 'Bloomington Yard',
  },
];

/** Builds `count` deterministic location rows by cycling the seed set. */
export function createMockLocations(count = 48): MockLocation[] {
  return Array.from({ length: count }, (_, index) => {
    const template = seed[index % seed.length];
    const cycle = Math.floor(index / seed.length);
    return {
      ...template,
      id: `LOC-${1001 + index}`,
      name: cycle === 0 ? template.name : `${template.name} ${cycle + 1}`,
    };
  });
}

export const mockLocations = createMockLocations(48);

export const mockBusinessUnits = [
  'Equipment Storage',
  'Facility Maintenance',
  'Regional Operations',
  'Warehouse Operations',
] as const;
