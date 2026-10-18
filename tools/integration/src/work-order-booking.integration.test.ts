import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCmsQueryClient,
  disposeCmsQueryClient,
} from '@cms/platform-contract';
import {
  formatExampleWorkOrderNumber,
  toWorkOrderBookingConfigUpdateDto,
  toWorkOrderBookingFormValues,
  updateWorkOrderBookingConfig,
  updateWorkOrderBookingConfigMutationOptions,
  workOrderBookingConfigQueryOptions,
  workOrderBookingKeys,
} from '@cms/settings-data-access';
import { configureCustomFetch } from '@cms/shared-api';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  configureCustomFetch({
    baseUrl: '/api/v1',
    getAuthToken: () => 'test-token',
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  configureCustomFetch({ baseUrl: '' });
});

describe('work order booking configuration', () => {
  it('maps API configuration to form values', () => {
    const dto = {
      sourceRequiredForCallBooking: false,
      showPendingMaintenancePopupOnCallBooking: true,
      serviceEarliestAvailability: { duration: 2, unit: 'Hours' as const },
      maintenanceEarliestAvailability: { duration: 1, unit: 'Days' as const },
      warrantyEarliestAvailability: { duration: 4, unit: 'Hours' as const },
      installationEarliestAvailability: { duration: 2, unit: 'Days' as const },
      workOrderNumberPrefix: 'WO',
      workOrderNumberBusinessUnitId: 3,
      workOrderNumberYearMode: 'CurrentYear' as const,
      workOrderNumberSequence: 1,
      isWorkOrderNumberSequenceLocked: false,
      customField1Label: 'Custom Field 1',
      customField2Label: null,
      customField3Label: null,
      customField4Label: null,
      canEdit: true,
      updatedBy: 'Admin',
      updatedOn: '2026-01-01T00:00:00.000Z',
    };

    const values = toWorkOrderBookingFormValues(dto);
    expect(values.workOrderNumberPrefix).toBe('WO');
    expect(values.workOrderNumberBusinessUnitId).toBe('3');
    expect(
      toWorkOrderBookingConfigUpdateDto(values).workOrderNumberPrefix,
    ).toBe('WO');
  });

  it('formats the example work order number from optional segments', () => {
    expect(
      formatExampleWorkOrderNumber({
        prefix: 'WO',
        businessUnitCode: '001',
        yearMode: 'CurrentYear',
        sequenceNumber: 1,
      }),
    ).toBe(`WO-001-${new Date().getFullYear()}-00001`);
    expect(
      formatExampleWorkOrderNumber({
        prefix: '',
        businessUnitCode: '',
        yearMode: 'Blank',
        sequenceNumber: 12,
      }),
    ).toBe('00012');
  });

  it('loads and updates through customFetch', async () => {
    const client = createCmsQueryClient();
    const configBody = {
      success: true,
      statusCode: 200,
      data: {
        sourceRequiredForCallBooking: false,
        showPendingMaintenancePopupOnCallBooking: false,
        serviceEarliestAvailability: { duration: 2, unit: 'Hours' },
        maintenanceEarliestAvailability: { duration: 1, unit: 'Days' },
        warrantyEarliestAvailability: { duration: 4, unit: 'Hours' },
        installationEarliestAvailability: { duration: 2, unit: 'Days' },
        workOrderNumberPrefix: 'WO',
        workOrderNumberBusinessUnitId: null,
        workOrderNumberYearMode: 'CurrentYear',
        workOrderNumberSequence: 1,
        isWorkOrderNumberSequenceLocked: false,
        customField1Label: null,
        customField2Label: null,
        customField3Label: null,
        customField4Label: null,
        canEdit: true,
        updatedBy: null,
        updatedOn: null,
      },
    };

    fetchMock.mockResolvedValueOnce(jsonResponse(configBody));

    const loaded = await client.fetchQuery(
      workOrderBookingConfigQueryOptions(),
    );
    expect(loaded.workOrderNumberPrefix).toBe('WO');

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const updateBody = toWorkOrderBookingConfigUpdateDto(
      toWorkOrderBookingFormValues(loaded),
    );
    await updateWorkOrderBookingConfig({
      ...updateBody,
      sourceRequiredForCallBooking: true,
    });

    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/v1/work-order-booking/configuration',
      expect.objectContaining({ method: 'PUT' }),
    );

    const mutation = updateWorkOrderBookingConfigMutationOptions(client);
    expect(mutation.meta?.feature).toBe('work-order-booking');
    expect(workOrderBookingKeys.configuration()).toEqual([
      'work-order-booking',
      'configuration',
    ]);

    disposeCmsQueryClient(client);
  });
});
