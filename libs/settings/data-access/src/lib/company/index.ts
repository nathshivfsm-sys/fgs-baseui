export {
  companyCollectionEndpoint,
  companyDetailEndpoint,
} from './company.endpoints';
export { companyKeys } from './company.keys';
export {
  patchCompany,
  patchCompanyMutationOptions,
} from './company.mutations';
export {
  companyDetailQueryOptions,
  loadCompany,
} from './company.queries';
export {
  companyAddressFormSchema,
  companyGeneralInfoFormSchema,
  companySettingsFormSchema,
  emptyCompanyAddressForm,
  formatPhoneNumber,
  isSameCompanyAddress,
  normalizePhoneNumber,
  toCompanyAddressDto,
  toCompanyAddressForm,
  toCompanyAddressValue,
  toCompanyPatch,
  toCompanyProfile,
  type CompanyAddress,
  type CompanyAddressForm,
  type CompanyDirtyFields,
  type CompanyGeneralInfo,
  type CompanyProfile,
  type CompanySettingsFormValues,
} from './company.form';
export {
  companyAddressDtoSchema,
  companyDetailResponseSchema,
  companyDtoSchema,
  companyPatchDtoSchema,
  type CompanyAddressDto,
  type CompanyDto,
  type CompanyPatchDto,
} from '@cms/settings-contract';
