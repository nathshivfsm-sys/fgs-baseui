import { attachmentHandlers } from './attachment';
import { billingCategoryHandlers } from './billing-category';
import { businessTypeHandlers } from './business-type';
import { jobCategoryHandlers } from './job-category';
import { jobTypeHandlers } from './job-type';
import { subcategoryHandlers } from './subcategory';
import { tagHandlers } from './tag';
import { employeeHandlers } from './employee';
import { authHandlers } from './auth';
import { geoLookupHandlers } from './geo-lookup';
import { inventoryLocationHandlers } from './inventory-location';
import { glBreakHandlers } from './gl-break';
import { paymentMethodHandlers } from './payment-method';
import { paymentTermHandlers } from './payment-term';
import { priceBookHandlers } from './price-book';
import { priceBookItemHandlers } from './price-book-item';
import { pricingMatrixHandlers } from './pricing-matrix';
import { pricingMatrixLaborHandlers } from './pricing-matrix-labor';
import { pricingMatrixLaborTierHandlers } from './pricing-matrix-labor-tier';
import { pricingMatrixMaterialTierHandlers } from './pricing-matrix-material-tier';
import { pricingMatrixOtherHandlers } from './pricing-matrix-other';
import { postalCodeHandlers } from './postal-code';
import { resolutionCodeHandlers } from './resolution-code';
import { salesActivityOutcomeHandlers } from './sales-activity-outcome';
import { salesActivityTypeHandlers } from './sales-activity-type';
import { salesPipelineStatusHandlers } from './sales-pipeline-status';
import { setupDescriptionHandlers } from './setup-description';
import { sourceHandlers } from './source';
import { companyHandlers } from './company';
import { nonWorkingDateHandlers } from './non-working-date';
import { taxHandlers } from './tax';
import { timeslotHandlers } from './timeslot';
import { taxAuthorityHandlers } from './tax-authority';
import { techSkillLevelHandlers } from './tech-skill-level';
import { techTradeHandlers } from './tech-trade';
import { workOrderBookingHandlers } from './work-order-booking';
import { zoneHandlers } from './zone';
import { userHandlers } from './user';
import { userRoleHandlers } from './user-role';
import { roleHandlers } from './role';
import { rolePermissionHandlers } from './role-permission';
import { permissionHandlers } from './permission';

/** Domain handlers composed for the browser worker. Add a file per domain. */
export const handlers = [
  ...authHandlers,
  ...companyHandlers,
  ...userHandlers,
  ...userRoleHandlers,
  ...roleHandlers,
  ...rolePermissionHandlers,
  ...permissionHandlers,
  ...taxHandlers,
  ...timeslotHandlers,
  ...workOrderBookingHandlers,
  ...taxAuthorityHandlers,
  ...geoLookupHandlers,
  ...inventoryLocationHandlers,
  ...paymentMethodHandlers,
  ...paymentTermHandlers,
  ...priceBookHandlers,
  ...priceBookItemHandlers,
  ...pricingMatrixHandlers,
  ...pricingMatrixLaborHandlers,
  ...pricingMatrixLaborTierHandlers,
  ...pricingMatrixMaterialTierHandlers,
  ...pricingMatrixOtherHandlers,
  ...postalCodeHandlers,
  ...resolutionCodeHandlers,
  ...salesActivityOutcomeHandlers,
  ...salesActivityTypeHandlers,
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
  ...tagHandlers,
  ...attachmentHandlers,
];
