import { http } from 'msw';
import { setupOk } from './util';

const truckLookup = [
  {
    id: 901,
    inventoryLocationCode: 'TRK-01',
    name: 'Truck 01',
  },
  {
    id: 902,
    inventoryLocationCode: 'TRK-02',
    name: 'Truck 02',
  },
];

export const inventoryLocationHandlers = [
  http.get('/api/v1/inventorylocation/lookup', ({ request }) => {
    const url = new URL(request.url);
    const locationType = url.searchParams.get('locationType');
    if (locationType === 'truck') {
      return setupOk(truckLookup);
    }
    return setupOk([]);
  }),
];
