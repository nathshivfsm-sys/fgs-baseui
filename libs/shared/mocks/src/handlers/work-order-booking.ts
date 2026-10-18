import { http } from 'msw';
import {
  workOrderBookingConfigUpdateDtoSchema,
  type WorkOrderBookingConfigDto,
} from '@cms/settings-contract';
import { firstIssueMessage, readJsonObject, setupError, setupOk } from './util';

function seedConfiguration(): WorkOrderBookingConfigDto {
  return {
    sourceRequiredForCallBooking: true,
    showPendingMaintenancePopupOnCallBooking: true,
    serviceEarliestAvailability: { duration: 2, unit: 'Hours' },
    maintenanceEarliestAvailability: { duration: 1, unit: 'Days' },
    warrantyEarliestAvailability: { duration: 4, unit: 'Hours' },
    installationEarliestAvailability: { duration: 2, unit: 'Days' },
    workOrderNumberPrefix: 'WO',
    workOrderNumberBusinessUnitId: 1,
    workOrderNumberYearMode: 'CurrentYear',
    workOrderNumberSequence: 1,
    isWorkOrderNumberSequenceLocked: false,
    customField1Label: 'Custom Field 1',
    customField2Label: 'Custom Field 2',
    customField3Label: 'Custom Field 3',
    customField4Label: 'Custom Field 4',
    canEdit: true,
    updatedBy: 'John Deo',
    updatedOn: '2026-01-15T10:30:00.000Z',
  };
}

let configuration = seedConfiguration();

export const workOrderBookingHandlers = [
  http.get('*/api/v1/work-order-booking/configuration', () =>
    setupOk(configuration),
  ),
  http.put('*/api/v1/work-order-booking/configuration', async ({ request }) => {
    if (!configuration.canEdit) {
      return setupError(
        403,
        'You do not have permission to change this configuration.',
      );
    }
    const json = await readJsonObject(request);
    const parsed = workOrderBookingConfigUpdateDtoSchema.safeParse(json);
    if (!parsed.success) {
      return setupError(400, firstIssueMessage(parsed.error));
    }
    const body = parsed.data;
    configuration = {
      ...configuration,
      ...body,
      isWorkOrderNumberSequenceLocked: true,
      updatedBy: 'John Deo',
      updatedOn: new Date().toISOString(),
    };
    return setupOk(configuration);
  }),
];
