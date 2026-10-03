import { z } from 'zod';
import type {
  TimeslotCreateDto,
  TimeslotSummaryDto,
  TimeslotUpdateDto,
} from '@cms/settings-contract';

const clockTime = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const timeslotFormSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(50),
  name: z.string().trim().min(1, 'Name is required').max(100),
  zoneId: z.string().trim().min(1, 'Zone is required'),
  beginTime: clockTime('Begin Time'),
  endTime: clockTime('End Time'),
  lateAfter: z.string(),
  delayedAfter: z.string(),
  isMobileVisible: z.boolean(),
  isCustomerPortalVisible: z.boolean(),
});

export type TimeslotForm = z.infer<typeof timeslotFormSchema>;

export const emptyTimeslotForm = (): TimeslotForm => ({
  code: '',
  name: '',
  zoneId: '',
  beginTime: '',
  endTime: '',
  lateAfter: '00:15:00',
  delayedAfter: '00:30:00',
  isMobileVisible: true,
  isCustomerPortalVisible: true,
});

const toSpan = (clock: string): string =>
  /^\d{2}:\d{2}$/.test(clock) ? `${clock}:00` : clock;

const toClockInput = (span: string | null | undefined): string => {
  const match = /^(\d{2}:\d{2})/.exec(span ?? '');
  return match?.[1] ?? '';
};

const optionalSpan = (value: string): string | null =>
  value.trim() === '' ? null : value;

export const toTimeslotCreateDto = (
  values: TimeslotForm,
): TimeslotCreateDto => ({
  fgsSetupZoneId: Number(values.zoneId),
  code: values.code,
  name: values.name,
  beginTime: toSpan(values.beginTime),
  endTime: toSpan(values.endTime),
  markTechArrivedLateAfter: optionalSpan(values.lateAfter),
  markWorkOrderDelayedCompletionAfter: optionalSpan(values.delayedAfter),
  isMobileVisible: values.isMobileVisible,
  isCustomerPortalVisible: values.isCustomerPortalVisible,
  includeInCapacityPlanning: true,
  showToExternalSystem: true,
});

export const toTimeslotFormValues = (
  record: TimeslotSummaryDto,
): TimeslotForm => ({
  code: record.code ?? '',
  name: record.name ?? '',
  zoneId: record.fgsSetupZoneId == null ? '' : String(record.fgsSetupZoneId),
  beginTime: toClockInput(record.beginTime),
  endTime: toClockInput(record.endTime),
  lateAfter: record.markTechArrivedLateAfter ?? '',
  delayedAfter: record.markWorkOrderDelayedCompletionAfter ?? '',
  isMobileVisible: record.isMobileVisible,
  isCustomerPortalVisible: record.isCustomerPortalVisible,
});

export const toTimeslotUpdateDto = (
  values: TimeslotForm,
  record: TimeslotSummaryDto,
): TimeslotUpdateDto => ({
  ...toTimeslotCreateDto(values),
  includeInCapacityPlanning: record.includeInCapacityPlanning,
  showToExternalSystem: record.showToExternalSystem,
});
