export const PAGE_TITLE = 'Pricebook';
export const PAGE_DESCRIPTION = 'Define and manage services.';
export const CREATE_PRICEBOOK_LABEL = 'Create Pricebook';
export const CREATE_PAGE_TITLE = 'Create Pricebook';
export const EDIT_PAGE_TITLE = 'Edit Pricebook';
export const EDITOR_DESCRIPTION = 'Build and price a service.';
export const PRICEBOOK_FORM_ID = 'pricebook-form';
export const PRICEBOOK_LIST_PAGE_SIZE = 1000;
export const PRICEBOOK_TABLE_PAGE_SIZE = 10;

export const SEARCH_PLACEHOLDER = 'Search service...';
export const NO_SERVICES_FOUND = 'No services found.';
export const LOAD_ERROR_TITLE = 'Unable to load price book';

export const CREATE_SUCCESS_TITLE = 'Service created';
export const CREATE_SUCCESS_MESSAGE = 'Service created successfully.';
export const UPDATE_SUCCESS_TITLE = 'Service updated';
export const UPDATE_SUCCESS_MESSAGE = 'Service updated successfully.';
export const SAVE_ERROR_TITLE = 'Could not save service';
export const SAVE_LABEL = 'Save';
export const CANCEL_LABEL = 'Cancel';

export const DEACTIVATE_TITLE = 'Deactivate service';
export const DEACTIVATE_DESCRIPTION =
  'The service stays in the price book and moves to the Inactive tab.';
export const DEACTIVATE_CONFIRM_LABEL = 'Deactivate';
export const DEACTIVATE_SUCCESS_TITLE = 'Service deactivated';
export const DEACTIVATE_SUCCESS_MESSAGE = 'The service was marked inactive.';
export const DEACTIVATE_ERROR_TITLE = 'Could not deactivate service';

export const DISCARD_TITLE = 'Discard unsaved changes?';
export const DISCARD_DESCRIPTION =
  'You have entered information that has not been saved. Leaving this page will discard your changes.';
export const DISCARD_CONFIRM_LABEL = 'Discard';

export const FILTER_LABEL = 'Filter';
export const FILTER_APPLY_LABEL = 'Apply';
export const FILTER_CLEAR_LABEL = 'Clear';
export const FILTER_ANY_LABEL = 'Any';
export const FILTER_JOB_TYPE_LABEL = 'Job Type';
export const FILTER_TAXABLE_LABEL = 'Is Taxable';
export const FILTER_YES_LABEL = 'Yes';
export const FILTER_NO_LABEL = 'No';

export const DETAILS_TAB = 'details';
export const MATERIAL_TAB = 'material';
export const EQUIPMENT_TAB = 'equipment';
export const OTHER_TAB = 'other';

export const ADD_ITEM_LABEL = 'Add Item';
export const SAVE_FIRST_MESSAGE =
  'Save the service before adding material, equipment, or other lines.';
export const LINE_COST_PRICE_MESSAGE =
  'Cost and price are not stored on a service line. Name, description, and quantity are saved.';
export const UNSAVED_PRICE_FIELDS_MESSAGE =
  'Membership and labor tax stay on this form only. The service stores the total of the price amounts, not each amount on its own. Changing an amount replaces the saved price with that total.';

export const LINE_CREATED_TITLE = 'Line added';
export const LINE_CREATED_MESSAGE = 'The line was added to this service.';
export const LINE_UPDATED_TITLE = 'Line updated';
export const LINE_UPDATED_MESSAGE = 'The line was updated.';
export const LINE_SAVE_ERROR_TITLE = 'Could not save line';
export const LINE_DELETE_TITLE = 'Delete line';
export const LINE_DELETE_DESCRIPTION =
  'This removes the line from the service.';
export const LINE_DELETE_CONFIRM_LABEL = 'Delete';
export const LINE_DELETED_TITLE = 'Line deleted';
export const LINE_DELETED_MESSAGE = 'The line was removed.';
export const LINE_DELETE_ERROR_TITLE = 'Could not delete line';

export const OTHER_LINE_TYPE_OPTIONS = [
  { label: 'Sub-Contractor', value: 'Sub-Contractor' },
  { label: 'MISC', value: 'MISC' },
] as const;

export const MEMBERSHIP_TYPE_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'Member', value: 'Member' },
  { label: 'Non-member', value: 'Non-member' },
] as const;

export const DISCOUNT_ACCOUNT_OPTIONS = [
  { label: 'Sales Discount', value: 'Sales Discount' },
] as const;

export const EMPTY_LIST_FILTERS = {
  jobTypeId: '',
  isTaxable: '',
} as const;
