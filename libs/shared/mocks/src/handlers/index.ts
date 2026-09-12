import { authHandlers } from './auth';
import { settingsHandlers } from './settings';
import { taxHandlers } from './tax';
import { taxAuthorityHandlers } from './tax-authority';
import { zoneHandlers } from './zone';

/** Domain handlers composed for the browser worker. Add a file per domain. */
export const handlers = [
  ...authHandlers,
  ...settingsHandlers,
  ...taxHandlers,
  ...taxAuthorityHandlers,
  ...zoneHandlers,
];
