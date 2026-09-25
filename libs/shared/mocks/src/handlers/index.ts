import { attachmentHandlers } from './attachment';
import { businessTypeHandlers } from './business-type';
import { employeeHandlers } from './employee';
import { authHandlers } from './auth';
import { geoLookupHandlers } from './geo-lookup';
import { glBreakHandlers } from './gl-break';
import { postalCodeHandlers } from './postal-code';
import { companyHandlers } from './company';
import { nonWorkingDateHandlers } from './non-working-date';
import { taxHandlers } from './tax';
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
  ...userHandlers,
  ...userRoleHandlers,
  ...roleHandlers,
  ...taxHandlers,
  ...taxAuthorityHandlers,
  ...geoLookupHandlers,
  ...postalCodeHandlers,
  ...nonWorkingDateHandlers,
  ...zoneHandlers,
  ...glBreakHandlers,
  ...employeeHandlers,
  ...techTradeHandlers,
  ...techSkillLevelHandlers,
  ...businessTypeHandlers,
  ...attachmentHandlers,
];
