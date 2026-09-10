import type { QueryRequestContext } from '@cms/platform-contract';
import { writeCompanySettingsStore } from '../mocks/company-settings.mock';
import type { CompanySettings } from '../schemas/company-settings.schema';

export type SaveCompanySettings = (
  companyId: string,
  settings: CompanySettings,
  context?: QueryRequestContext,
) => Promise<CompanySettings>;

export const saveCompanySettings: SaveCompanySettings = async (
  companyId,
  settings,
) => writeCompanySettingsStore(companyId, settings);
