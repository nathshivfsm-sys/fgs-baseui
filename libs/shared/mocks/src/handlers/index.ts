import { attachmentHandlers } from './attachment';
import { billingCategoryHandlers } from './billing-category';
import { businessTypeHandlers } from './business-type';
import { jobCategoryHandlers } from './job-category';
import { jobTypeHandlers } from './job-type';
import { subcategoryHandlers } from './subcategory';
import { employeeHandlers } from './employee';
import { authHandlers } from './auth';
import { geoLookupHandlers } from './geo-lookup';
import { inventoryLocationHandlers } from './inventory-location';
import { glBreakHandlers } from './gl-break';
import { paymentTermHandlers } from './payment-term';
import { postalCodeHandlers } from './postal-code';
import { resolutionCodeHandlers } from './resolution-code';
import { salesPipelineStatusHandlers } from './sales-pipeline-status';
import { setupDescriptionHandlers } from './setup-description';
import { sourceHandlers } from './source';
import { companyHandlers } from './company';
import { customerHandlers } from './customer';
import { serviceLocationHandlers } from './service-location';
import { nonWorkingDateHandlers } from './non-working-date';
import { tagHandlers } from './tag';
import { taxHandlers } from './tax';
import { timeslotHandlers } from './timeslot';
import { taxAuthorityHandlers } from './tax-authority';
import { techSkillLevelHandlers } from './tech-skill-level';
import { techTradeHandlers } from './tech-trade';
import { zoneHandlers } from './zone';
import { userHandlers } from './user';
import { userRoleHandlers } from './user-role';
import { roleHandlers } from './role';

/** Domain handlers composed for the browser worker. Add a file per domain. */
export const handlers = [
  ...authHandlers,
  ...companyHandlers,
  ...customerHandlers,
  ...serviceLocationHandlers,
  ...userHandlers,
  ...userRoleHandlers,
  ...roleHandlers,
  ...taxHandlers,
  ...timeslotHandlers,
  ...taxAuthorityHandlers,
  ...geoLookupHandlers,
  ...inventoryLocationHandlers,
  ...paymentTermHandlers,
  ...tagHandlers,
  ...postalCodeHandlers,
  ...resolutionCodeHandlers,
  ...salesPipelineStatusHandlers,
  ...setupDescriptionHandlers,
  ...sourceHandlers,
  ...nonWorkingDateHandlers,
  ...zoneHandlers,
  ...glBreakHandlers,
  ...employeeHandlers,
  ...techTradeHandlers,
  ...techSkillLevelHandlers,
  ...billingCategoryHandlers,
  ...businessTypeHandlers,
  ...jobCategoryHandlers,
  ...jobTypeHandlers,
  ...subcategoryHandlers,
  ...attachmentHandlers,
];
