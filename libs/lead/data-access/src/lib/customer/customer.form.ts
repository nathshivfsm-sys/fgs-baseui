import { z } from 'zod';
import {
  customerCreationOptionSchema,
  customerTypeSchema,
  serviceLocationTypeSchema,
  type CustomerCreateDto,
} from '@cms/lead-contract';

const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;

function phoneDigitCount(value: string): number {
  return value.replace(/\D/g, '').length;
}

const optionalEmailSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || z.email().safeParse(value).success,
    'Enter a valid email address',
  );

const optionalPhoneSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (value === '') return true;
    const digits = phoneDigitCount(value);
    return digits >= 10 && digits <= 15;
  }, 'Enter a valid phone number');

const optionalWebsiteSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || WEBSITE_PATTERN.test(value),
    'Enter a valid website, e.g. www.example.com',
  );

export const customerAddressFormSchema = z.object({
  addressLine1: z
    .string()
    .trim()
    .min(1, 'Address line 1 is required')
    .max(200, 'Address line 1 must be 200 characters or fewer'),
  addressLine2: z
    .string()
    .trim()
    .max(200, 'Address line 2 must be 200 characters or fewer'),
  city: z
    .string()
    .trim()
    .min(1, 'City is required')
    .max(100, 'City must be 100 characters or fewer'),
  state: z
    .string()
    .trim()
    .min(1, 'State is required')
    .max(100, 'State must be 100 characters or fewer'),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Postal code is required')
    .max(20, 'Postal code must be 20 characters or fewer'),
  country: z.string().trim().min(1, 'Country is required'),
});

export type CustomerAddressForm = z.infer<typeof customerAddressFormSchema>;

const customerAddressValueSchema = customerAddressFormSchema.nullable();

const serviceLocationFormSchema = z.object({
  name: z.string().trim(),
  displayName: z.string().trim(),
  customerType: customerTypeSchema,
  serviceLocationType: serviceLocationTypeSchema,
  address: customerAddressValueSchema,
  primaryContactName: z.string().trim(),
  primaryContactEmail: optionalEmailSchema,
  primaryContactPhone: optionalPhoneSchema,
  canReceiveEstimates: z.boolean(),
  canReceiveInvoices: z.boolean(),
  canReceiveAppointments: z.boolean(),
  tagIds: z.array(z.number()),
  break1Id: z.string().trim(),
});

export type ServiceLocationFormValues = z.infer<
  typeof serviceLocationFormSchema
>;

const arCustomerFormFields = {
  name: z.string().trim(),
  displayName: z.string().trim(),
  address: customerAddressValueSchema,
  primaryContactName: z.string().trim(),
  primaryContactEmail: optionalEmailSchema,
  primaryContactPhone: optionalPhoneSchema,
  website: optionalWebsiteSchema,
  defaultPaymentTermId: z.string().trim(),
  taxExempt: z.boolean(),
  tagIds: z.array(z.number()),
};

function requireAddress(
  ctx: z.RefinementCtx,
  address: CustomerAddressForm | null,
  path: (string | number)[],
  label: string,
) {
  if (address == null) {
    ctx.addIssue({
      code: 'custom',
      message: `${label} is required`,
      path,
    });
    return;
  }
  const parsed = customerAddressFormSchema.safeParse(address);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      ctx.addIssue({ ...issue, path: [...path, ...issue.path] });
    }
  }
}

function refineBillToAndServiceLocation(
  values: z.infer<typeof billToAndServiceLocationFormSchema>,
  ctx: z.RefinementCtx,
) {
  const sl = values.serviceLocation;
  if (sl.name.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Location name is required',
      path: ['serviceLocation', 'name'],
    });
  }
  if (sl.displayName.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Display name is required',
      path: ['serviceLocation', 'displayName'],
    });
  }
  requireAddress(ctx, sl.address, ['serviceLocation', 'address'], 'Address');

  if (values.defaultPaymentTermId.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Payment terms are required',
      path: ['defaultPaymentTermId'],
    });
  }

  if (values.sameAsServiceLocation) {
    return;
  }

  if (values.name.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Customer name is required',
      path: ['name'],
    });
  }
  if (values.displayName.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Display name is required',
      path: ['displayName'],
    });
  }
  requireAddress(ctx, values.address, ['address'], 'Billing address');
}

function refineBillToOnly(
  values: z.infer<typeof billToOnlyFormSchema>,
  ctx: z.RefinementCtx,
) {
  if (values.name.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Customer name is required',
      path: ['name'],
    });
  }
  if (values.displayName.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Display name is required',
      path: ['displayName'],
    });
  }
  if (values.defaultPaymentTermId.length === 0) {
    ctx.addIssue({
      code: 'custom',
      message: 'Payment terms are required',
      path: ['defaultPaymentTermId'],
    });
  }
  requireAddress(ctx, values.address, ['address'], 'Billing address');
}

const billToAndServiceLocationFormSchema = z
  .object({
    creationOption: z.literal('billToAndServiceLocation'),
    sameAsServiceLocation: z.boolean(),
    serviceLocation: serviceLocationFormSchema,
    ...arCustomerFormFields,
  })
  .superRefine(refineBillToAndServiceLocation);

const billToOnlyFormSchema = z
  .object({
    creationOption: z.literal('billToOnly'),
    sameAsServiceLocation: z.literal(false).optional(),
    serviceLocation: serviceLocationFormSchema,
    ...arCustomerFormFields,
  })
  .superRefine(refineBillToOnly);

export const customerCreateFormSchema = z.discriminatedUnion('creationOption', [
  billToAndServiceLocationFormSchema,
  billToOnlyFormSchema,
]);

export type CustomerCreateForm = z.infer<typeof customerCreateFormSchema>;

export function emptyServiceLocationFormValues(): ServiceLocationFormValues {
  return {
    name: '',
    displayName: '',
    customerType: 'residential',
    serviceLocationType: 'residential',
    address: null,
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    canReceiveEstimates: true,
    canReceiveInvoices: true,
    canReceiveAppointments: true,
    tagIds: [],
    break1Id: '',
  };
}

export function emptyCustomerCreateForm(): CustomerCreateForm {
  return {
    creationOption: 'billToAndServiceLocation',
    sameAsServiceLocation: true,
    serviceLocation: emptyServiceLocationFormValues(),
    name: '',
    displayName: '',
    address: null,
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    website: '',
    defaultPaymentTermId: '',
    taxExempt: false,
    tagIds: [],
  };
}

function emptyToNull(value: string): string | null {
  return value === '' ? null : value;
}

export function normalizeCustomerPhone(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length === 10 ? `1${digits}` : digits;
}

function composeFormattedAddress(address: CustomerAddressForm): string {
  const line1 = address.addressLine1.trim();
  const line2 = address.addressLine2.trim();
  const cityState = [address.city.trim(), address.state.trim()]
    .filter(Boolean)
    .join(', ');
  const cityStateZip = [cityState, address.postalCode.trim()]
    .filter(Boolean)
    .join(' ');
  return [line1, line2, cityStateZip].filter(Boolean).join(', ');
}

function spreadAddress(address: CustomerAddressForm | null) {
  if (!address) {
    return {
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      city: null,
      state: null,
      county: null,
      country: null,
      postalCode: null,
      formattedAddress: null,
      latitude: null,
      longitude: null,
      placeId: null,
    };
  }
  return {
    addressLine1: address.addressLine1.trim(),
    addressLine2: emptyToNull(address.addressLine2),
    addressLine3: null,
    addressLine4: null,
    city: address.city.trim(),
    state: address.state.trim(),
    county: null,
    country: address.country.trim(),
    postalCode: address.postalCode.trim(),
    formattedAddress: composeFormattedAddress(address),
    latitude: null,
    longitude: null,
    placeId: null,
  };
}

function parseOptionalId(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function resolveArFields(values: CustomerCreateForm) {
  if (
    values.creationOption === 'billToAndServiceLocation' &&
    values.sameAsServiceLocation
  ) {
    const sl = values.serviceLocation;
    return {
      name: sl.name.trim(),
      displayName: sl.displayName.trim(),
      address: sl.address,
      primaryContactName: emptyToNull(sl.primaryContactName),
      primaryContactEmail: emptyToNull(sl.primaryContactEmail),
      primaryContactPhone: normalizeCustomerPhone(sl.primaryContactPhone),
    };
  }

  return {
    name: values.name.trim(),
    displayName: values.displayName.trim(),
    address: values.address,
    primaryContactName: emptyToNull(values.primaryContactName),
    primaryContactEmail: emptyToNull(values.primaryContactEmail),
    primaryContactPhone: normalizeCustomerPhone(values.primaryContactPhone),
  };
}

export function toCustomerCreateDto(
  values: CustomerCreateForm,
): CustomerCreateDto {
  const ar = resolveArFields(values);
  const paymentTermId = parseOptionalId(values.defaultPaymentTermId);

  const base: CustomerCreateDto = {
    customerNumber: null,
    name: ar.name,
    displayName: ar.displayName,
    ...spreadAddress(ar.address),
    primaryContactName: ar.primaryContactName,
    primaryContactEmail: ar.primaryContactEmail,
    primaryContactPhone: ar.primaryContactPhone,
    website: emptyToNull(values.website),
    defaultPaymentTermId: paymentTermId,
    defaultMaterialPricingMatrixId: null,
    defaultLaborPricingMatrixId: null,
    defaultOtherPricingMatrixId: null,
    defaultPORequired: false,
    taxExempt: values.taxExempt,
    taxExemptNumber: null,
    customerAccountNumber: null,
    externalEntityId: null,
    externalVersion: null,
    creationOption: values.creationOption,
    tagIds: values.tagIds.length > 0 ? values.tagIds : null,
  };

  if (values.creationOption === 'billToOnly') {
    return base;
  }

  const sl = values.serviceLocation;
  const break1Id = parseOptionalId(sl.break1Id);

  return {
    ...base,
    serviceLocation: {
      serviceLocationType: sl.serviceLocationType,
      customerType: sl.customerType,
      name: sl.name.trim(),
      displayName: sl.displayName.trim(),
      ...spreadAddress(sl.address),
      taxExempt: null,
      primaryContactName: emptyToNull(sl.primaryContactName),
      primaryContactEmail: emptyToNull(sl.primaryContactEmail),
      primaryContactPhone: normalizeCustomerPhone(sl.primaryContactPhone),
      canReceiveEstimates: sl.canReceiveEstimates,
      canReceiveInvoices: sl.canReceiveInvoices,
      canReceiveAppointments: sl.canReceiveAppointments,
      tagIds: sl.tagIds.length > 0 ? sl.tagIds : null,
      break1Id,
      break2Id: null,
    },
  };
}

export function hasCustomerAddress(
  address: CustomerAddressForm | null,
): address is CustomerAddressForm {
  return address != null;
}
