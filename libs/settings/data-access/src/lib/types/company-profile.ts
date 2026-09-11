import type { CompanyGeneralInfo } from '../schemas/company-settings.schema';

export interface CompanyAddress {
  /** Non-empty street lines, in order (`addressLine1`..`addressLine4`). */
  lines: string[];
  city: string;
  state: string;
  postalCode: string;
  /** ISO country code as the API returns it, e.g. `US`. */
  country: string;
}

/** What the General Info screen renders: the editable form plus read-only context. */
export interface CompanyProfile {
  /** Read-only; equals the login `companyId` and is the endpoint's path key. */
  companyNumber: string;
  /** Read-only; a server-generated slug. */
  code: string;
  generalInfo: CompanyGeneralInfo;
  physicalAddress: CompanyAddress | null;
  billingAddress: CompanyAddress | null;
}

type NullableOnWire = 'companySize' | 'taxId' | 'website';

/** `PATCH /company/{companyId}` body — only the fields the user changed. */
export type CompanyPatch = Partial<
  Omit<CompanyGeneralInfo, NullableOnWire> &
    Record<NullableOnWire, string | null>
>;

/** React Hook Form's `dirtyFields` for the flat General Info form. */
export type CompanyDirtyFields = Partial<
  Readonly<Record<keyof CompanyGeneralInfo, boolean | undefined>>
>;
