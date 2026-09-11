import { authHandlers } from './auth';
import { settingsHandlers } from './settings';

/** Domain handlers composed for the browser worker. Add a file per domain. */
export const handlers = [...authHandlers, ...settingsHandlers];
