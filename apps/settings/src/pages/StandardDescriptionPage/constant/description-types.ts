export type DescriptionTypeNavConfig = {
  code: string;
  title: string;
  description: string;
};

/** Swagger / glo lookup codes that show the Trade column and field. */
export const TRADE_FIELD_TYPE_CODES = new Set([
  'REASON_FOR_CALL',
  'WORK_DESCRIPTION',
]);

export const DESCRIPTION_TYPE_NAV: readonly DescriptionTypeNavConfig[] = [
  {
    code: 'REASON_FOR_CALL',
    title: 'Reason For Call',
    description: 'Define reasons customers may request a service.',
  },
  {
    code: 'WORK_DESCRIPTION',
    title: 'Work Description',
    description: 'Define standard descriptions for work performed.',
  },
  {
    code: 'CANCELLATION_REASON',
    title: 'Cancellation reason',
    description: 'Define reasons for cancelling jobs or appointments.',
  },
  {
    code: 'LEAD_DISQUALIFICATION',
    title: 'Lead Disqualification Reason',
    description: 'Define reasons for disqualifying a lead.',
  },
];
