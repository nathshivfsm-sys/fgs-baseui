export const TAX_SETUP_PATH = 'company/tax';
export const SETUP_PATH = '..';

export const PAGE_TITLE = 'Tax Setup';
export const PAGE_DESCRIPTION =
  'Configure tax jurisdictions, rates, and state-level settings for accurate invoicing.';

export const ADD_TAX_CODE_LABEL = 'Add Tax Code';
export const ASSIGN_AUTHORITY_LABEL = 'Assign Authority';
export const SEARCH_TAX_RATES_PLACEHOLDER = 'Search tax rates...';
export const SEARCH_TAX_CODES_PLACEHOLDER = 'Search tax codes...';

export const AUTHORITY_NAV_DESCRIPTION =
  'Manage tax authorities and their respective rates';
export const TAX_CODE_NAV_DESCRIPTION = 'Manage tax code and their rates';

export const RECOMMENDATIONS = [
  'Assign the correct State and County to ensure accurate tax calculations on invoices.',
  'Tax rates drive pricing and invoice totals automatically.',
  'Use the Tax Name field to clearly identify the jurisdiction (e.g., county + city).',
  'Keep tax rates updated to reflect current state and local regulations.',
] as const;

export const SAVE_SUCCESS_TITLE = 'Saved';
export const SAVE_ERROR_TITLE = 'Could not save';
export const AUTHORITY_CREATED_MESSAGE = 'Tax authority created';
export const AUTHORITY_UPDATED_MESSAGE = 'Tax authority updated';
export const TAX_CREATED_MESSAGE = 'Tax rate created';
export const TAX_UPDATED_MESSAGE = 'Tax rate updated';
export const LOAD_AUTHORITIES_ERROR_TITLE = 'Unable to load tax authorities';
export const LOAD_TAX_CODES_ERROR_TITLE = 'Unable to load tax codes';
export const LOAD_AUTHORITIES_ERROR_TOAST_ID = 'tax-authority-list-error';
export const LOAD_TAX_CODES_ERROR_TOAST_ID = 'tax-code-list-error';

export const CREATE_AUTHORITY_TITLE = 'Add Taxing Authority';
export const CREATE_AUTHORITY_DESCRIPTION =
  'Assign a tax authority and define its rate';
export const EDIT_AUTHORITY_TITLE = 'Edit Taxing Authority';
export const EDIT_AUTHORITY_DESCRIPTION =
  'Update the tax authority and its rate';
export const AUTHORITY_NAME_PLACEHOLDER = 'e.g. Sales Tax – Harris County';
export const AUTHORITY_RATE_PLACEHOLDER = 'e.g. 8.25';

export const CREATE_TAX_TITLE = 'Add Tax Rate';
export const CREATE_TAX_DESCRIPTION =
  'Add a tax rate and define its jurisdiction';
export const EDIT_TAX_TITLE = 'Edit Tax Rate';
export const EDIT_TAX_DESCRIPTION = 'Update the tax rate and its jurisdiction';
export const TAX_CODE_PLACEHOLDER = 'Enter Sales Tax Code';
export const TAX_NAME_PLACEHOLDER = 'Enter Sales Tax Name';
export const TAX_COUNTY_PLACEHOLDER = 'Enter County Name';
export const TAX_STATE_PLACEHOLDER = 'Select State';
export const TAX_CITY_PLACEHOLDER = 'Select City';
