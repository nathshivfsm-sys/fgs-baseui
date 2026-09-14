import { attachmentHandlers } from './attachment';
import { authHandlers } from './auth';
import { companyHandlers } from './company';
import { nonWorkingDateHandlers } from './non-working-date';
import { taxHandlers } from './tax';
import { taxAuthorityHandlers } from './tax-authority';
import { zoneHandlers } from './zone';

/** Domain handlers composed for the browser worker. Add a file per domain. */
export const handlers = [
  ...authHandlers,
  ...companyHandlers,
  ...taxHandlers,
  ...taxAuthorityHandlers,
  ...nonWorkingDateHandlers,
  ...zoneHandlers,
  ...attachmentHandlers,
];
